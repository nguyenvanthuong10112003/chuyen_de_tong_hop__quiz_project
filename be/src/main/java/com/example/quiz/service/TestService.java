package com.example.quiz.service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.LongStream;

import com.example.quiz.dto.request.*;
import com.example.quiz.dto.response.*;
import com.example.quiz.entity.*;
import com.example.quiz.helper.DataUtil;
import com.example.quiz.mapper.*;
import com.example.quiz.repository.*;
import org.springframework.stereotype.Service;

import com.example.quiz.exception.AppException;
import com.example.quiz.exception.ErrorCode;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class TestService extends BaseAuthedService {
    TestRepository testRepository;
    QuestionRepository questionRepository;
    TestMapper testMapper;
    ClaszRepository claszRepository;
    SubjectRepository subjectRepository;
    QuestionGroupRepository questionGroupRepository;
    TestQNumberMapper testQNumberMapper;
    TestQNumberRepository testQNumberRepository;
    ClassUserInfoRepository classUserInfoRepository;
    TestSessionRepository testSessionRepository;
    QuestionGroupMapper questionGroupMapper;
    TestSessionMapper testSessionMapper;
    QuestionMapper questionMapper;
    AnswerMapper answerMapper;
    SessionChangeHistoryRepository sessionChangeHistoryRepository;
    TestHistoryRepository testHistoryRepository;
    ContentMapper contentMapper;
    PhotoService photoService;
    TestHistoryMapper testHistoryMapper;
    @Transactional
    public void createTest(TestAddRequest request) {
        // validate
        User currentUser = getCurrentUser();

        validate(request);

        var clasz = claszRepository.findByIdAndOwnerId(request.getClassId(), currentUser.getId())
            .orElseThrow(() -> new AppException(ErrorCode.CLASS_NOT_EXISTED));

        String subjectId = request.getSubjectId();
        var subject = subjectRepository.findByIdAndCreatorAndStatus(subjectId, currentUser.getId(), 1L)
            .orElseThrow(() -> new AppException(ErrorCode.SUBJECT_NOT_EXISTED));

        List<String> lstGroupId = request.getLstGroupId();
        List<QuestionGroup> realByLstId = questionGroupRepository.findAllBySubjectAndLstId(subjectId, lstGroupId);

        if (lstGroupId.size() != realByLstId.size())
            throw new AppException(ErrorCode.ANY_QUESTION_NOT_IN_SUBJECT);

        var newTest = new Test();
        List<TestQNumber> groups = new ArrayList<>();
        for (int index = 0; index < realByLstId.size(); index++)
            groups.add(TestQNumber.builder().group(clone(realByLstId.get(index))).number(index).build());
        testMapper.update(request, newTest);
        newTest.setSubject(subject);
        newTest.setGroups(groups);
        newTest.setClasz(clasz);
        testRepository.save(newTest);
    }

    @Transactional
    public void updateTest(TestUpdateRequest request) {
        User currentUser = getCurrentUser();

        validate(request);

        var oldTest = testRepository.findByIdAndUser(request.getId(), currentUser.getId())
            .orElseThrow(() -> new AppException(ErrorCode.TEST_NOT_EXISTED));

        LocalDateTime now = LocalDateTime.now().plusSeconds(-1);

        // >= start time and <= end time
        if (oldTest.getStartTime().isBefore(now) && oldTest.getEndTime().isAfter(now))
            throw new RuntimeException("Cannot update test at this time");

        String subjectId = request.getSubjectId();
        var subject = subjectRepository.findByIdAndCreatorAndStatus(subjectId, currentUser.getId(), 1L)
            .orElseThrow(() -> new AppException(ErrorCode.SUBJECT_NOT_EXISTED));

        List<String> lstGroupId = request.getLstGroupId();
        List<QuestionGroup> realByLstId = questionGroupRepository.findAllBySubjectAndLstId(subjectId, lstGroupId);

        if (lstGroupId.size() != realByLstId.size())
            throw new AppException(ErrorCode.ANY_QUESTION_NOT_IN_SUBJECT);

        List<TestQNumber> groups = new ArrayList<>();
        for (int index = 0; index < realByLstId.size(); index++)
            groups.add(TestQNumber.builder().group(clone(realByLstId.get(index))).number(index).build());

        testQNumberRepository.deleteAll(oldTest.getGroups());

        testMapper.update(request, oldTest);
        oldTest.setSubject(subject);
        oldTest.setGroups(groups);
        testRepository.save(oldTest);
    }

    public void deleteTest(String testId) {
        User currentUser = getCurrentUser();
        Test test = testRepository.findByIdAndOwnerId(testId, currentUser.getId())
            .orElseThrow(() -> new AppException(ErrorCode.TEST_NOT_EXISTED));
        test.setStatus(false);
        testRepository.save(test);
    }

    private void validate(TestAddRequest request) {
        LocalDateTime startTime = request.getStartTime();
        LocalDateTime endTime = request.getEndTime();

        if (startTime.isAfter(endTime))
            throw new AppException(ErrorCode.START_TIME_NEED_BEFORE_END_TIME);

        LocalDateTime now = LocalDateTime.now();

        if (endTime.isBefore(now))
            throw new RuntimeException("End time need after now");

        if (now.plusMinutes(request.getTime()).isAfter(endTime))
            throw new RuntimeException("Now to end time need at least " + request.getTime() + " minutes");
    }

    public TestResponse getById(String id) {
        String currentUserId = getCurrentUserId();
        var test = testRepository.findByIdAndUser(id, currentUserId)
            .orElseThrow(() -> new AppException(ErrorCode.TEST_NOT_EXISTED));
        var response = testMapper.toResponse(test);
        if (!test.getClasz().getOwner().getId().equals(currentUserId)) {
            var session = testSessionRepository.findSessionActive(test.getId(), currentUserId).orElse(null);
            response.setSessionId(session == null ? null : session.getId());
            return response;
        }
        response.setGroups(testQNumberMapper.toListResponse(test.getGroups()));
        return response;
    }

    @Transactional
    public SessionResponse createSession(SessionAddRequest request) {
        User currentUser = getCurrentUser();
        LocalDateTime now = LocalDateTime.now();
        Test test = testRepository.findById(request.getTestId())
            .orElseThrow(() -> new AppException(ErrorCode.TEST_NOT_EXISTED));
        if (now.isBefore(test.getStartTime()))
            throw new RuntimeException("Test haven't start");
        if (now.isAfter(test.getEndTime()))
            throw new RuntimeException("Test ended");
        var classUserInfo = classUserInfoRepository.findByClaszIdAndUserIdAndStatus(test.getClasz().getId(), currentUser.getId(), true)
            .orElseThrow(() -> new RuntimeException("Student not in class"));
        var lstSession = testSessionRepository.findAllByTestIdAndStudentId(test.getId(), classUserInfo.getId());
        if (!CollectionUtils.isEmpty(lstSession)) {
            if (lstSession.stream().anyMatch(session -> (!DataUtil.boolValue(session.getIsSubmitted()) ||
                now.isBefore(session.getEndTime()) ||
                now.isEqual(session.getEndTime())) && session.getSubmitTime() == null))
                throw new RuntimeException("Student already in a session");
            if (lstSession.size() >= test.getMaxCountDo())
                throw new RuntimeException("Out of max turn");
        }

        LocalDateTime timeEnd = now.plusMinutes(test.getTime());
        timeEnd = timeEnd.isAfter(test.getEndTime()) ? test.getEndTime() : timeEnd;

        TestSession newSession = TestSession.builder()
            .test(test)
            .student(classUserInfo)
            .startTime(LocalDateTime.now())
            .endTime(timeEnd)
            .time(test.getTime())
            .build();

        newSession = testSessionRepository.save(newSession);

        List<QuestionGroup> sessionGroups = cloneAll(buildListSessionGroup(test, newSession));

        questionGroupRepository.saveAll(sessionGroups);

        return testSessionMapper.toResponse(newSession);
    }

    private List<QuestionGroup> buildListSessionGroup(Test test, TestSession session) {
        if (test == null || CollectionUtils.isEmpty(test.getGroups())) return new ArrayList<>();
        List<QuestionGroup> rs = new ArrayList<>(testQNumberMapper.toLstSessionQuestionGroup(test.getGroups()).stream().peek(group -> group.setSession(session)).toList());
        if (!DataUtil.boolValue(test.getIsMix()))
            return rs;

        Collections.shuffle(rs);
        for (int index = 0; index < rs.size(); index++) {
            QuestionGroup sessionQuestionGroup = rs.get(index);
            sessionQuestionGroup.setNumber(index);
            if (CollectionUtils.isEmpty(sessionQuestionGroup.getQuestions())) continue;
            sessionQuestionGroup.setQuestions(new ArrayList<>(sessionQuestionGroup.getQuestions().stream().peek(question -> {
                if (question == null || CollectionUtils.isEmpty(question.getAnswers())) return;
                Collections.shuffle(question.getAnswers());
                for (int i = 0; i < question.getAnswers().size(); i++)
                    question.getAnswers().get(i).setNo(i);
            }).toList()));
            if (!DataUtil.boolValue(sessionQuestionGroup.getCanMix())) continue;
            Collections.shuffle(sessionQuestionGroup.getQuestions());
            for (int i = 0; i < sessionQuestionGroup.getQuestions().size(); i++)
                sessionQuestionGroup.getQuestions().get(i).setNo(i);
        }
        return rs;
    }

    private QuestionGroup clone(QuestionGroup group) {
        if (group == null) return null;
        var clone = questionGroupMapper.clone(group);
        if (clone == null) return null;
        clone.setId(null);
        clone.setParentId(group.getParentId() == null ? group.getId() : group.getParentId());
        if (!CollectionUtils.isEmpty(group.getContents()))
            clone.setContents(group.getContents().stream().map(this::cloneContent).toList());
        if (!CollectionUtils.isEmpty(group.getQuestions()))
            clone.setQuestions(group.getQuestions().stream().map(question -> {
                var questionClone = questionMapper.clone(question);
                if (questionClone == null) return null;
                questionClone.setId(null);
                if (!CollectionUtils.isEmpty(question.getContents()))
                    questionClone.setContents(question.getContents().stream().map(this::cloneContent).toList());
                if (!CollectionUtils.isEmpty(questionClone.getAnswers()))
                    questionClone.setAnswers(question.getAnswers().stream().map(answer -> {
                        var answerClone = answerMapper.clone(answer);
                        if (answerClone == null) return null;
                        if (!CollectionUtils.isEmpty(answer.getContents()))
                            answerClone.setContents(answer.getContents().stream().map(this::cloneContent).toList());
                        answerClone.setId(null);
                        return answerClone;
                    }).toList());
                return questionClone;
            }).toList());
        return clone;
    }

    private List<QuestionGroup> cloneAll(List<QuestionGroup> groups) {
        if (CollectionUtils.isEmpty(groups)) return new ArrayList<>();
        return groups.stream().map(this::clone).toList();
    }

    private Content cloneContent(Content content) {
        Content clone = contentMapper.clone(content);
        clone.setId(null);
        if (!ContentType.PHOTO.equals(clone.getType())) return clone;
        clone.setPhoto(photoService.copy(content.getPhoto()));
        return clone;
    }

    @Transactional
    public void changeAnswer(ChangeAnswerSessionRequest request) {
        User currentUser = getCurrentUser();
        TestSession session = testSessionRepository.findByIdAndUser(request.getSessionId(), currentUser.getId())
            .orElseThrow(() -> new RuntimeException("Session not found"));
        if (DataUtil.boolValue(session.getIsSubmitted()))
            throw new RuntimeException("Submitted");
        LocalDateTime now = LocalDateTime.now();
        if (now.isAfter(session.getEndTime()))
            throw new RuntimeException("Expired");
        if (CollectionUtils.isEmpty(session.getGroups())) return;
        if (CollectionUtils.isEmpty(request.getChanges())) return;
        Map<String, Set<String>> mapQuestionIdAnswersId = new HashMap<>();
        request.getChanges().forEach(change -> {
            if (mapQuestionIdAnswersId.containsKey(change.getQuestionId()))
                throw new RuntimeException("Dup questionId");
            Set<String> singleAnswerId = new HashSet<>(change.getLstAnswerId());
            mapQuestionIdAnswersId.put(change.getQuestionId(), singleAnswerId);
        });
        List<Question> questions = questionRepository.findAllByLstQuestionId(new ArrayList<>(mapQuestionIdAnswersId.keySet()));
        if (questions.size() != mapQuestionIdAnswersId.size())
            throw new RuntimeException("Any question not exist");
        Map<String, Question> mapIdQuestion = new HashMap<>();
        questions.forEach(question -> mapIdQuestion.put(question.getId(), question));
        sessionChangeHistoryRepository.inactiveAllBySessionAndLstQuestion(new ArrayList<>(mapQuestionIdAnswersId.keySet()), session.getId());
        List<SessionChangeHistory> sessionChangeHistories = new ArrayList<>();
        mapQuestionIdAnswersId.keySet().forEach(questionId -> {
            Question question = mapIdQuestion.get(questionId);
            if (question == null) return;
            if (CollectionUtils.isEmpty(question.getAnswers())) return;
            if (CollectionUtils.isEmpty(mapQuestionIdAnswersId.get(questionId))) return;

            Set<String> singleAnswerId = new HashSet<>(mapQuestionIdAnswersId.get(questionId));
            List<QuestionAnswer> answers = question.getAnswers().stream().filter(item -> singleAnswerId.contains(item.getId())).toList();
            if (answers.size() != singleAnswerId.size())
                throw new RuntimeException("Any answer not exist");

            sessionChangeHistories.addAll(answers.stream()
                .map(answer -> SessionChangeHistory.builder()
                    .session(session)
                    .question(question)
                    .answer(answer)
                    .build())
                .toList());
        });
        sessionChangeHistoryRepository.saveAll(sessionChangeHistories);
    }

    public SessionResponse getSessionById(String sessionId) {
        User currentUser = getCurrentUser();
        TestSession session = testSessionRepository.findByIdAndUser(sessionId, currentUser.getId())
            .orElseThrow(() -> new RuntimeException("Session not found"));
        session.getTest().setGroups(null);
        SessionResponse response = testSessionMapper.toResponse(session);
        if (CollectionUtils.isEmpty(session.getGroups())) return response;
        List<SessionChangeHistory> historiesLatest = sessionChangeHistoryRepository.findAllHistoryLatestBySession(session.getId());
        Map<String, String> mapQuestionAnswer = new HashMap<>();
        if (!CollectionUtils.isEmpty(historiesLatest))
            historiesLatest.forEach(item -> {
                mapQuestionAnswer.put(item.getQuestion().getId(), item.getAnswer().getId());
            });
        response.setGroups(questionGroupMapper.toListResponseSortByNumber(session.getGroups()).stream().peek(group -> {
            if (CollectionUtils.isEmpty(group.getQuestions())) return;
            group.getQuestions().forEach(question -> {
                if (mapQuestionAnswer.containsKey(question.getId()))
                    question.setAnswerSelectedId(mapQuestionAnswer.get(question.getId()));
                if (!CollectionUtils.isEmpty(question.getAnswers()))
                    question.getAnswers().forEach(answer -> answer.setIsCorrect(null));
            });
        }).toList());
        return response;
    }

    @Transactional
    public void submit(String sessionId, boolean isProcess) {
        TestSession session = testSessionRepository.findById(sessionId)
            .orElseThrow(() -> new RuntimeException("Session not found"));
        if (!isProcess) {
            String currentUserId = getCurrentUserId();
            if (!session.getStudent().getUser().getId().equals(currentUserId))
                throw new AppException(ErrorCode.UNAUTHORIZE);
        }
        if (testHistoryRepository.existsBySessionId(sessionId))
            throw new RuntimeException("Submitted");
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime submitTime = now.isAfter(session.getEndTime()) ? session.getEndTime() : now;

        session.setSubmitTime(submitTime);
        session.setIsSubmitted(true);
        testSessionRepository.save(session);

        List<SessionChangeHistory> changeLatest = sessionChangeHistoryRepository.findAllHistoryLatestBySession(sessionId);
        Map<String, List<SessionChangeHistory>> mapQuestionIdChange = new HashMap<>();
        List<Question> questions = new ArrayList<>();
        if (!CollectionUtils.isEmpty(changeLatest))
            changeLatest.forEach(change -> {
                String questionId = change.getQuestion().getId();
                if (mapQuestionIdChange.containsKey(questionId))
                    mapQuestionIdChange.get(questionId).add(change);
                else {
                    mapQuestionIdChange.put(change.getQuestion().getId(), new ArrayList<>() {{
                        add(change);
                    }});
                    questions.add(change.getQuestion());
                }
            });

        long correctNum = 0L;
        long questionNum = session.getGroups().stream()
            .flatMapToLong(group -> LongStream.of(group.getQuestions() == null ? 0 : group.getQuestions().size())).sum();
        long maxScore = session.getTest().getTotalScore();
        double scorePerQuestion = (double) maxScore / questionNum;

        if (!CollectionUtils.isEmpty(questions))
            for (Question question : questions) {
                List<SessionChangeHistory> changes = mapQuestionIdChange.get(question.getId());
                if (CollectionUtils.isEmpty(changes)) continue;
                if (CollectionUtils.isEmpty(question.getAnswers())) continue;
                SessionChangeHistory latest = changes.get(0);
                Set<String> singerAnswerId = new HashSet<>();
                boolean isAllCorrect = true;
                for (SessionChangeHistory change : changes) {
                    if (change.getCreatedTime().isAfter(latest.getCreatedTime()))
                        latest = change;
                    singerAnswerId.add(change.getAnswer().getId());
                    if (!DataUtil.boolValue(change.getAnswer().getIsCorrect()))
                        isAllCorrect = false;
                }
                if (QuestionType.CHOICE.equals(question.getType())) {
                    if (DataUtil.boolValue(latest.getAnswer().getIsCorrect()))
                        correctNum++;
                } else if (isAllCorrect) {
                    int countCorrect = 0;
                    for (QuestionAnswer answer : question.getAnswers()) {
                        if (DataUtil.boolValue(answer.getIsCorrect()))
                            countCorrect++;
                    }
                    if (countCorrect == singerAnswerId.size())
                        correctNum++;
                }
            }

        TestHistory testHistory = TestHistory.builder()
            .session(session)
            .student(session.getStudent())
            .test(session.getTest())
            .totalTime(Duration.between(session.getStartTime(), submitTime).getSeconds())
            .choseNum(questions.size())
            .correctNum(correctNum)
            .incorrectNum(questions.size() - correctNum)
            .totalScore(scorePerQuestion * (double) correctNum)
            .startTime(session.getStartTime())
            .submitTime(submitTime)
            .build();

        testHistoryRepository.save(testHistory);
    }

    public List<TestHistoryResponse> getAllByTest(String testId) {
        User currentUser = getCurrentUser();
        List<TestHistory> histories = testHistoryRepository.findAllByTestIdAndUserId(testId, currentUser.getId());
        if (CollectionUtils.isEmpty(histories)) return List.of();
        return testHistoryMapper.toListResponse(histories);
    }

    public List<ClassUserInfoResponse> getAllHistoryByTest(String testId) {
        User currentUser = getCurrentUser();
        if (!testRepository.existsByIdAndOwnerId(testId, currentUser.getId()))
            throw new AppException(ErrorCode.UNAUTHORIZE);
        return testHistoryRepository.getAllByTest(testId);
    }

    public List<SessionChangeHistoryResponse> getAllChangeLatestBySession(String sessionId) {
        User currentUser = getCurrentUser();
        TestSession session = testSessionRepository.findByIdAndUser(sessionId, currentUser.getId())
            .orElseThrow(() -> new RuntimeException("Student not in session"));
        List<SessionChangeHistory> changes = sessionChangeHistoryRepository.findAllHistoryLatestBySession(sessionId);
        Map<String, Set<String>> mapQuestionIdLstAnswerId = new HashMap<>();
        changes.forEach(change -> {
            String questionId = change.getQuestion().getId();
            if (mapQuestionIdLstAnswerId.containsKey(questionId))
                mapQuestionIdLstAnswerId.get(questionId).add(change.getAnswer().getId());
            else
                mapQuestionIdLstAnswerId.put(questionId, new HashSet<>() {{add(change.getAnswer().getId());}});
        });
        return mapQuestionIdLstAnswerId.keySet().stream().map(questionId -> SessionChangeHistoryResponse.builder().questionId(questionId).lstAnswerId(mapQuestionIdLstAnswerId.get(questionId).stream().toList()).build()).toList();
    }
}
