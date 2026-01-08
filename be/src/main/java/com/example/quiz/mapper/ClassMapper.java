package com.example.quiz.mapper;

import java.util.List;

import com.example.quiz.dto.response.ClassDetailResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.example.quiz.dto.request.ClassCreationRequest;
import com.example.quiz.dto.request.ClassUpdateRequest;
import com.example.quiz.dto.response.ClassResponse;
import com.example.quiz.entity.Clasz;

@Mapper(componentModel = "spring", uses = {PhotoMapper.class, UserMapper.class})

public interface ClassMapper {
    
    Clasz toClass(ClassCreationRequest request);

    @Mapping(target = "studentCount", expression = "java(clasz.getStudents().size())")
    ClassResponse toClassResponse(Clasz clasz);

    @Mapping(target = "studentCount", expression = "java(clasz.getStudents().size())")
    @Mapping(target = "students", ignore = true)
    @Mapping(target = "alerts", ignore = true)
    @Mapping(target = "tests", ignore = true)
    @Mapping(target = "requests", ignore = true)
    ClassDetailResponse toClassDetailResponse(Clasz clasz);
    
    List<ClassResponse> toListClassResponse(List<Clasz> Class);

    //@Mapping(target = "id", ignore = true)
    void toUpdateClass(@MappingTarget Clasz clazz, ClassUpdateRequest request);
}