package com.example.quiz.mapper;

import com.example.quiz.dto.request.ContentRequest;
import com.example.quiz.dto.response.ContentResponse;
import com.example.quiz.entity.Content;
import com.example.quiz.entity.ContentType;
import com.example.quiz.entity.PhotoTemp;
import com.example.quiz.entity.Question;
import com.example.quiz.exception.AppException;
import com.example.quiz.exception.ErrorCode;
import com.example.quiz.helper.DataUtil;
import com.example.quiz.repository.PhotoTempRepository;
import org.apache.logging.log4j.util.Strings;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Collections;
import java.util.Comparator;
import java.util.List;

@Mapper(componentModel = "spring", uses = {PhotoMapper.class})
public abstract class ContentMapper {
    @Autowired
    private PhotoTempRepository photoTempRepository;
    public Content toEntity(ContentRequest request) {
        Content.ContentBuilder contentBuilder = Content.builder().no(request.getNo());
        if (!Strings.isEmpty(request.getContent()))
            return contentBuilder.content(request.getContent()).type(ContentType.TEXT).build();
        else if (!Strings.isEmpty(request.getPhotoId())) {
            PhotoTemp temp = photoTempRepository.findByPhotoId(request.getPhotoId())
                .orElseThrow(() -> new AppException(ErrorCode.PHOTO_NOT_EXISTED));
            if (DataUtil.boolValue(temp.getStatus())) {
                temp.setStatus(false);
                photoTempRepository.save(temp);
            }
            contentBuilder.photo(temp.getPhoto()).type(ContentType.PHOTO);
        }
        return contentBuilder.build();
    }
    abstract List<Content> toListEntity(List<ContentRequest> requests);
    @Mapping(target = "photoId", source = "entity.photo.id")
    abstract ContentResponse toResponse(Content entity);
    public List<ContentResponse> toListResponse(List<Content> entities) {
        if (entities == null || entities.isEmpty()) return Collections.emptyList();
        entities.sort(Comparator.comparingInt(Content::getNo));
        return entities.stream().map(this::toResponse).toList();
    }
    public abstract Content clone(Content content);
}
