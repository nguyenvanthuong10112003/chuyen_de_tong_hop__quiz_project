package com.example.quiz.service;

import java.util.*;

import com.example.quiz.dto.request.QuestionGroupAddRequest;
import com.example.quiz.dto.request.QuestionGroupEditRequest;
import com.example.quiz.dto.request.RemoveRequest;
import com.example.quiz.dto.request.RemoveType;
import com.example.quiz.dto.response.QuestionGroupResponse;
import com.example.quiz.dto.response.SubjectResponse;
import com.example.quiz.entity.*;
import com.example.quiz.exception.AppException;
import com.example.quiz.exception.ErrorCode;
import com.example.quiz.helper.DataUtil;
import com.example.quiz.mapper.ContentMapper;
import com.example.quiz.mapper.QuestionGroupMapper;
import com.example.quiz.mapper.SubjectMapper;
import com.example.quiz.repository.*;
import lombok.experimental.NonFinal;
import org.apache.logging.log4j.util.Strings;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import com.example.quiz.mapper.QuestionMapper;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.transaction.annotation.Transactional;


@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class QuestionService extends BaseAuthedService {
    QuestionRepository questionRepository;
    QuestionMapper questionMapper;
    SubjectRepository subjectRepository;
    ContentMapper contentMapper;
    QuestionGroupMapper questionGroupMapper;
    PhotoTempRepository photoTempRepository;
    TopicRepository topicRepository;
    QuestionGroupRepository questionGroupRepository;
    ContentRepository contentRepository;
    TopicService topicService;
    SubjectService subjectService;
    @NonFinal
    QuestionService self;
    public List<QuestionGroupResponse> search(String subjectId, String topicId) {
        return questionGroupMapper.toListResponse(questionGroupRepository.search(topicId, subjectId, getCurrentUserId()));
    }
    @Autowired
    public void setSelf(@Lazy QuestionService self) {
        this.self = self;
    }

    @Transactional(rollbackFor = Exception.class)
    public void createQuestion(QuestionGroupAddRequest groupRequest) {
        User currentUser = getCurrentUser();
        QuestionGroup newQuestionGroup = questionGroupMapper.toEntity(groupRequest);
        //validate
        validate(newQuestionGroup);
        Subject subject = buildSubject(groupRequest, currentUser);
        Topic topic = buildTopic(groupRequest, subject);
        newQuestionGroup.setTopic(topic);
        questionGroupRepository.save(newQuestionGroup);
    }

    @Transactional(rollbackFor = Exception.class)
    public void updateQuestion(QuestionGroupEditRequest groupRequest) {
        User currentUser = getCurrentUser();
        QuestionGroup questionGroup = questionGroupRepository
            .findByIdAndUser(groupRequest.getId(), currentUser.getId())
                .orElseThrow(() -> new AppException(ErrorCode.QUESTION_NOT_EXISTED));

        //xoa
        // Lấy photo từ group contents
        List<String> lstDel = new ArrayList<>(getsPhotoFromContents(questionGroup.getContents()));
        // Lấy từ từng question
        for (Question q : questionGroup.getQuestions()) {
            // 1) From question.contents
            lstDel.addAll(getsPhotoFromContents(q.getContents()));
            // 2) From question.answers[*].contents
            for (QuestionAnswer a : q.getAnswers()) {
                lstDel.addAll(getsPhotoFromContents(a.getContents()));
            }
        }
        photoTempRepository.updateStatusAll(false, lstDel);

        contentRepository.deleteAll(questionGroup.getContents());
        questionRepository.deleteAll(questionGroup.getQuestions());
        questionGroupMapper.update(questionGroup, groupRequest);

        //validate
        validate(questionGroup);

        var oldTopic = questionGroup.getTopic();
        var oldSubject = oldTopic.getSubject();
        Subject subject = buildSubject(groupRequest, currentUser);
        Topic topic = buildTopic(groupRequest, subject);
        questionGroup.setTopic(topic);

        questionGroupRepository.save(questionGroup);

        if (oldTopic.getId().equals(topic.getId()))
            return;

        topicRepository.inactiveStatus(oldTopic.getId(), currentUser.getId());
        subjectRepository.inactiveStatus(oldSubject.getId(), currentUser.getId());
    }

    private List<String> getsPhotoFromContents(List<Content> lst) {
        if (lst == null || lst.isEmpty()) return Collections.emptyList();
        return lst.stream()
            .filter(content -> content.getType().equals(ContentType.PHOTO))
            .map(content -> content.getPhoto().getId())
            .toList();
    }

    private void validate(QuestionGroup newQuestionGroup) {
        Map<Integer, Integer> countNo = new HashMap<>();
        newQuestionGroup.getQuestions().forEach(question -> {
            countNo.compute(question.getNo(), (k, count) -> count == null ? 1 : count + 1);
            if (question.getContents().stream().allMatch(item -> Strings.isBlank(item.getContent())))
                throw new RuntimeException("question content is required");
            if (question.getAnswers().stream().noneMatch(item -> DataUtil.boolValue(item.getIsCorrect())))
                throw new RuntimeException("Must at least 1 answer correct");
        });
    }

    private Subject buildSubject(QuestionGroupAddRequest groupRequest, User currentUser) {
        if (DataUtil.boolValue(groupRequest.getIsSubjectCreate())) {
            Subject newSubject = Subject.builder()
                    .creator(currentUser)
                    .name(groupRequest.getNewSubject().trim())
                    .build();
            if (subjectRepository.existsByNameAndCreatorId(newSubject.getName(), currentUser.getId()))
                throw new RuntimeException("Subject existed");
            return subjectRepository.save(newSubject);
        }
        return subjectRepository.findByIdAndCreatorAndStatus(groupRequest.getSubjectId(), currentUser.getId(), 1L)
            .orElseThrow(() -> new RuntimeException("Subject not existed"));
    }

    private Topic buildTopic(QuestionGroupAddRequest groupRequest, Subject subject) {
        if (DataUtil.boolValue(groupRequest.getIsTopicCreate())) {
            Topic newTopic = Topic.builder()
                .subject(subject)
                .name(groupRequest.getNewTopic())
                .build();
            if (topicRepository.existsByNameAndSubjectId(newTopic.getName(), subject.getId()))
                throw new RuntimeException("Topic existed");

            return topicRepository.save(newTopic);
        }
        Topic topic = topicRepository.findByIdAndStatus(groupRequest.getTopicId(), true)
            .orElseThrow(() -> new RuntimeException("Topic not existed"));
        if (!topic.getSubject().getId().equals(subject.getId()))
            throw new RuntimeException("Subject don't have this topic");
        return topic;
    }

    public List<QuestionGroupResponse> getsByTopic(String topicId) {
        var lst = questionGroupRepository.findAllByTopicAndUser(topicId, getCurrentUserId());
        return questionGroupMapper
            .toListResponse(lst);
    }

    public QuestionGroupResponse getById(String id) {
        return questionGroupMapper.toResponse(
            questionGroupRepository.findByIdAndUser(id, getCurrentUserId())
                .orElseThrow(() -> new AppException(ErrorCode.QUESTION_NOT_EXISTED)));
    }

    @Transactional
    public void delete(List<RemoveRequest> requests) {
        requests.forEach(item -> {
            RemoveType type = item.getType();
            if (type.equals(RemoveType.SUBJECT))
                subjectService.deleteSubjects(item.getLstId());
            else if (type.equals(RemoveType.TOPIC))
                topicService.deleteTopics(item.getLstId());
            else if (type.equals(RemoveType.GROUP))
                self.deleteGroups(item.getLstId());
        });
    }

    @Transactional
    public void deleteGroups(List<String> lstGroupId) {
        if (lstGroupId == null || lstGroupId.isEmpty()) return;
        questionGroupRepository.deleteMany(lstGroupId, getCurrentUserId());
    }
}
