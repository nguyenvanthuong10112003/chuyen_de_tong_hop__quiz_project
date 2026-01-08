package com.example.quiz.controller;

import com.example.quiz.dto.response.PhotoResponse;
import com.example.quiz.dto.response.ResponseApi;
import com.example.quiz.entity.Photo;
import com.example.quiz.service.PhotoService;
import com.example.quiz.validator.image.ImageConstraint;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/photos")
@RequiredArgsConstructor
public class PhotoController {

    private final PhotoService photoService;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseApi<List<PhotoResponse>> upload(
            @RequestPart("files") @Valid @NotEmpty List<@ImageConstraint MultipartFile> files) {
        return ResponseApi.createSuccess(photoService.upload(files));
    }

    @GetMapping("/{id}")
    public ResponseEntity<byte[]> get(@PathVariable String id) {
        Photo img = photoService.load(id);
        return ResponseEntity.ok()
            .contentType(MediaType.parseMediaType(img.getData().getContentType()))
            .body(img.getData().getData());
    }
}
