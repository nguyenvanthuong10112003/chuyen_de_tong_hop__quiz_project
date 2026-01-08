package com.example.quiz.service;

import java.util.List;

import com.example.quiz.dto.request.*;
import com.example.quiz.dto.response.ClassDetailResponse;
import com.example.quiz.dto.response.ClassRequestResponse;
import com.example.quiz.dto.response.ClassUserInfoResponse;
import com.example.quiz.entity.*;
import com.example.quiz.helper.DataUtil;
import com.example.quiz.mapper.*;
import com.example.quiz.repository.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.quiz.dto.response.ClassResponse;
import com.example.quiz.exception.AppException;
import com.example.quiz.exception.ErrorCode;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;
import org.springframework.util.ObjectUtils;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ClassService extends BaseAuthedService {
    ClaszRepository classRepository;
    UserRepository userRepository;
    ClassMapper classMapper;
    UserMapper userMapper;
    PhotoService photoService;
    PasswordEncoder passwordEncoder;
    ClassRequestRepository classRequestRepository;
    ClassUserInfoRepository classUserInfoRepository;
    ClassAlertService classAlertService;
    ClassAlertMapper classAlertMapper;
    ClassUserInfoMapper classUserInfoMapper;
    TestMapper testMapper;
    ClassRequestMapper classRequestMapper;
    @Transactional
    public void createClass(ClassCreationRequest request) {
        User user = getCurrentUser();

        if (classRepository.existsByNameAndOwnerId(request.getName(), user.getId()))
            throw new AppException(ErrorCode.CLASS_EXISTED);

        if (DataUtil.boolValue(request.getIsPrivate())) {
            if (!StringUtils.hasLength(request.getKeyJoin()))
                throw new AppException(ErrorCode.KEY_JOIN_REQUIRED);
            request.setKeyJoin(passwordEncoder.encode(request.getKeyJoin()));
        }

        Clasz clasz = classMapper.toClass(request);
        clasz.setOwner(user);
        if (request.getPhotoFile() != null)
            try {
                clasz.setPhoto(photoService.save(request.getPhotoFile()));
            } catch (Exception ignored) {}

        classRepository.save(clasz);
    }
    @Transactional
    public void updateClass(ClassUpdateRequest request) {
        User user = getCurrentUser();
        Clasz clasz = classRepository.findById(request.getId())
            .orElseThrow(() -> new AppException(ErrorCode.CLASS_NOT_EXISTED));
        Boolean oldAutoApprove = clasz.getIsAutoApprove();

        if (!clasz.getOwner().getId().equals(user.getId()))
            throw new AppException(ErrorCode.UNAUTHORIZE);

        if (!clasz.getName().equals(request.getName()) &&
                classRepository.existsByNameAndOwnerId(request.getName(), user.getId()))
            throw new AppException(ErrorCode.CLASS_EXISTED);

        if (DataUtil.boolValue(request.getIsPrivate())) {
            if (!StringUtils.hasLength(request.getKeyJoin()))
                throw new AppException(ErrorCode.KEY_JOIN_REQUIRED);
            request.setKeyJoin(passwordEncoder.encode(request.getKeyJoin()));
        }

        Photo oldPhoto = clasz.getPhoto();
        clasz.setPhoto(null);
        if (request.getPhotoFile() != null)
            try {
                clasz.setPhoto(photoService.save(request.getPhotoFile()));
            } catch (Exception ignored) {}

        classMapper.toUpdateClass(clasz, request);
        classRepository.save(clasz);

        if (oldPhoto != null)
            photoService.delete(oldPhoto.getId());

        if (!DataUtil.boolValue(request.getIsAutoApprove()) ||
            DataUtil.boolValue(oldAutoApprove))
            return;

        var requests = classRequestRepository.findAllByClaszIdAndType(clasz.getId(), RequestType.REQUEST);
        if (requests == null || requests.isEmpty()) return;
        requests.forEach(req -> {
            var newUserInfo = createClassUserInfo(req.getUser(), clasz);
            classUserInfoRepository.save(newUserInfo);
            classAlertService.saveAlert(clasz, String.format(NEW_USER_JOINED, newUserInfo.getName()));
        });
        classRequestRepository.deleteAll(requests);
    }
    public List<ClassResponse> getsMindClass() {
        User user = getCurrentUser();
        return classMapper.toListClassResponse(
            classRepository.findAllByOwner(user.getId()));
    }
    public List<ClassResponse> getsJoinedClass() {
        User user = getCurrentUser();
        return classMapper.toListClassResponse(
            classRepository.findAllJoined(user.getId()));
    }
    public List<ClassResponse> searchOtherClass(PageableRequest<SearchOtherClassParamsRequest> request) {
        User user = getCurrentUser();
        return classMapper.toListClassResponse(
            classRepository.searchAllOther(
                user.getId(),
                request.getParams().getKey(),
                buildPageable(request)).getContent());
    }
    public ClassResponse getById(String classId) {
        return classMapper.toClassResponse(
            classRepository.findByIdAndStatus(classId, true)
                .orElseThrow(() -> new AppException(ErrorCode.CLASS_NOT_EXISTED)));
    }
    public ClassDetailResponse getDetailById(String classId) {
        String currentUserId = getCurrentUserId();
        Clasz entity = classRepository.findByIdAndStatus(classId, true)
            .orElseThrow(() -> new AppException(ErrorCode.CLASS_NOT_EXISTED));
        if (!entity.getOwner().getId().equals(currentUserId) && !CollectionUtils.isEmpty(entity.getStudents()) && entity.getStudents().stream().noneMatch(stu -> DataUtil.boolValue(stu.getStatus())))
            throw new AppException(ErrorCode.CLASS_NOT_EXISTED);
        ClassDetailResponse classDetailResponse = classMapper.toClassDetailResponse(entity);
        boolean isTeacher = currentUserId.equals(entity.getOwner().getId());
        boolean isStudent = entity.getStudents().stream().anyMatch(item -> item.getUser().getId().equals(currentUserId) && DataUtil.boolValue(item.getStatus()));
        if (!isStudent && !isTeacher) {
            classDetailResponse.setRequest(classRequestMapper.toResponse(
                classRequestRepository.findByClaszIdAndUserId(classId, currentUserId).orElse(null)
            ));
            return classDetailResponse;
        }
        classDetailResponse.setIsUserJoined(true);
        if (!CollectionUtils.isEmpty(entity.getAlerts()))
            classDetailResponse.setAlerts(classAlertMapper.toListResponse(entity.getAlerts().stream()
                .filter(alert -> DataUtil.boolValue(alert.getStatus())).toList()));
        if (!CollectionUtils.isEmpty(entity.getStudents()))
            classDetailResponse.setStudents(classUserInfoMapper.toListResponse(entity.getStudents().stream()
                .filter(stu -> DataUtil.boolValue(stu.getStatus())).toList()));
        if (!CollectionUtils.isEmpty(entity.getTests()))
            classDetailResponse.setTests(testMapper.toListTestResponse(entity.getTests().stream()
                .filter(test -> DataUtil.boolValue(test.getStatus())).toList()));
        if (isTeacher && !CollectionUtils.isEmpty(entity.getRequests()))
            classDetailResponse.setRequests(classRequestMapper.toListResponse(entity.getRequests().stream()
                .filter(req -> DataUtil.boolValue(req.getStatus())).toList()));
        return classDetailResponse;
    }
    @Transactional
    public void deleteClass(String classId) {
        var user = getCurrentUser();
        var clasz = classRepository.findByIdAndStatus(classId, true)
            .orElseThrow(() -> new AppException(ErrorCode.CLASS_NOT_EXISTED));
        if (!clasz.getOwner().getId().equals(user.getId()))
            throw new AppException(ErrorCode.UNAUTHORIZE);
        clasz.setStatus(false);
        classRepository.save(clasz);
    }
    @Transactional
    public ClassRequestResponse sendRequestJoinClass(JoinClassRequest request) {
        var user = getCurrentUser();

        var clasz = classRepository.findByIdAndStatus(request.getClassId(), true)
            .orElseThrow(() -> new AppException(ErrorCode.CLASS_NOT_EXISTED));

        // kiem tra người xin không phải là chủ lớp
        if (user.getId().equals(clasz.getOwner().getId()))
            throw new AppException(ErrorCode.EXCEPTION);

        // nếu lớp học là riêng tư, phải có mật khẩu tham gia
        if (DataUtil.boolValue(clasz.getIsPrivate())) {
            if (!StringUtils.hasLength(request.getKeyJoin()))
                throw new AppException(ErrorCode.KEY_JOIN_REQUIRED);
            if (!passwordEncoder.matches(request.getKeyJoin(), clasz.getKeyJoin()))
                throw new AppException(ErrorCode.PASSWORD_INCORRECT);
        }

        // kiem tra người xin tham gia đã tham gia lớp trước đó chưa
        if (classUserInfoRepository.existsByClaszIdAndUserIdAndStatus(request.getClassId(), user.getId(), true))
            throw new AppException(ErrorCode.CLASS_JOINED);

        // kiem tra người xin tham gia đã xin trước đó chưa
        if (classRequestRepository.existsByClaszIdAndTypeAndUserId(request.getClassId(), RequestType.REQUEST, user.getId()))
            throw new AppException(ErrorCode.CLASS_SENT);

        var requestEntity = classRequestRepository
            .findByClaszIdAndTypeAndUserId(request.getClassId(), RequestType.INVITE, user.getId()).orElse(null);

        if (DataUtil.boolValue(clasz.getIsAutoApprove()) ||
            requestEntity != null) {
            ClassUserInfo newRow = createClassUserInfo(user, clasz);
            classUserInfoRepository.save(newRow);
            classAlertService.saveAlert(clasz, String.format(NEW_USER_JOINED, newRow.getName()));

            if (requestEntity != null)
                classRequestRepository.delete(requestEntity);

            return null;
        }

        ClassRequest newClassRequest = ClassRequest.builder()
            .user(user)
            .clasz(clasz)
            .type(RequestType.REQUEST)
            .build();

        newClassRequest = classRequestRepository.save(newClassRequest);

        return classRequestMapper.toResponse(newClassRequest);
    }
    @Transactional
    public ClassRequestResponse inviteJoinClass(InviteJoinClassRequest request) {
        var user = getCurrentUser();

        if (user.getId().equals(request.getUserId()))
            throw new AppException(ErrorCode.EXCEPTION);

        var receiver = userRepository.findById(request.getUserId())
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        var clasz = classRepository.findByIdAndStatus(request.getClassId(), true)
            .orElseThrow(() -> new AppException(ErrorCode.CLASS_NOT_EXISTED));

        // kiem tra user co phai chủ lớp
        if (!clasz.getOwner().getId().equals(user.getId()))
            throw new AppException(ErrorCode.UNAUTHORIZE);

        // kiểm tra người được mời đã có trong lớp
        if (classUserInfoRepository.existsByClaszIdAndUserIdAndStatus(request.getClassId(), receiver.getId(), true))
            throw new AppException(ErrorCode.CLASS_JOINED);

        // kiểm tra người được mời đã được mời trước đó chưa
        if (classRequestRepository.existsByClaszIdAndTypeAndUserId(request.getClassId(), RequestType.INVITE, receiver.getId()))
            throw new AppException(ErrorCode.CLASS_INVITED);

        var req = classRequestRepository
            .findByClaszIdAndTypeAndUserId(request.getClassId(), RequestType.REQUEST, receiver.getId()).orElse(null);

        if (req != null) {
            ClassUserInfo newRow = createClassUserInfo(receiver, clasz);
            classUserInfoRepository.save(newRow);
            classAlertService.saveAlert(clasz, String.format(NEW_USER_JOINED, newRow.getName()));
            classRequestRepository.delete(req);
            return null;
        }

        ClassRequest newClassInvite = ClassRequest.builder()
            .user(receiver)
            .clasz(clasz)
            .type(RequestType.INVITE)
            .build();

        newClassInvite = classRequestRepository.save(newClassInvite);

        return classRequestMapper.toResponse(newClassInvite);
    }
    private ClassUserInfo createClassUserInfo(User user, Clasz clasz) {
        ClassUserInfo.ClassUserInfoBuilder builder =
            ClassUserInfo.builder().user(user).clasz(clasz).name(user.getDisplayName());
        if (user.getAvatar() != null) {
            builder.photo(photoService.copy(user.getAvatar()));
        }
        return builder.build();
    }
    @Transactional
    public ClassUserInfoResponse acceptRequest(String classRequestId) {
        var currentUser = getCurrentUser();
        var request = classRequestRepository.findByIdAndType(classRequestId, RequestType.REQUEST)
            .orElseThrow(() -> new AppException(ErrorCode.CLASS_REQUEST_NOT_EXISTED));

        if (!currentUser.getId().equals(request.getClasz().getOwner().getId()))
            throw new AppException(ErrorCode.UNAUTHORIZE);

        ClassUserInfo newRow = createClassUserInfo(request.getUser(), request.getClasz());
        classUserInfoRepository.save(newRow);
        classAlertService.saveAlert(request.getClasz(), String.format(NEW_USER_JOINED, newRow.getName()));
        classRequestRepository.delete(request);
        return classUserInfoMapper.toResponse(newRow);
    }
    @Transactional
    public void acceptInvite(String classInviteId) {
        var currentUser = getCurrentUser();
        var invite = classRequestRepository.findByIdAndType(classInviteId, RequestType.INVITE)
            .orElseThrow(() -> new AppException(ErrorCode.CLASS_INVITE_NOT_EXISTED));

        if (!currentUser.getId().equals(invite.getUser().getId()))
            throw new AppException(ErrorCode.UNAUTHORIZE);

        ClassUserInfo newRow = createClassUserInfo(invite.getUser(), invite.getClasz());
        classUserInfoRepository.save(newRow);
        classAlertService.saveAlert(invite.getClasz(), String.format(NEW_USER_JOINED, newRow.getName()));
        classRequestRepository.delete(invite);
    }
    @Transactional
    public void leaveClass(String classId) {
        var user = getCurrentUser();
        var userInfo = classUserInfoRepository.findByClaszIdAndUserIdAndStatus(classId, user.getId(), true)
            .orElseThrow(() -> new AppException(ErrorCode.CLASS_USER_NOT_EXISTED));
        userInfo.setStatus(false);
        classUserInfoRepository.save(userInfo);
        classAlertService.saveAlert(userInfo.getClasz(), String.format(USER_LEAVE, userInfo.getName()));
    }
    @Transactional
    public void kickUser(String classUserInfoId) {
        var user = getCurrentUser();
        var userInfo = classUserInfoRepository.findById(classUserInfoId)
            .orElseThrow(() -> new AppException(ErrorCode.CLASS_USER_NOT_EXISTED));
        if (!DataUtil.boolValue(userInfo.getStatus()))
            throw new AppException(ErrorCode.CLASS_USER_NOT_EXISTED);
        if (!user.getId().equals(userInfo.getClasz().getOwner().getId()))
            throw new AppException(ErrorCode.UNAUTHORIZE);
        userInfo.setStatus(false);
        classUserInfoRepository.save(userInfo);
        classAlertService.saveAlert(userInfo.getClasz(), String.format(USER_KICKED, userInfo.getName()));
    }
    @Transactional
    public ClassUserInfoResponse updateInfoStudent(StudentInfoUpdateRequest request) {
        var user = getCurrentUser();
        var userInfo = classUserInfoRepository.findByClaszIdAndUserIdAndStatus(request.getClassId(), user.getId(), true)
            .orElseThrow(() -> new AppException(ErrorCode.CLASS_USER_NOT_EXISTED));

        Photo oldPhoto = userInfo.getPhoto();
        userInfo.setPhoto(null);

        if (request.getPhoto() != null) {
            try {
                userInfo.setPhoto(photoService.save(request.getPhoto()));
            } catch (Exception ignored) {}
        }

        userInfo.setName(request.getName());
        userInfo = classUserInfoRepository.save(userInfo);
        if (oldPhoto != null)
            photoService.delete(oldPhoto.getId());
        return classUserInfoMapper.toResponse(userInfo);
    }
    final String NEW_USER_JOINED = "%s has join";
    final String USER_LEAVE = "%s leave group";
    final String USER_KICKED = "%s kicked out of group";
}
