package com.example.quiz.service;

import com.example.quiz.dto.response.PhotoResponse;
import com.example.quiz.entity.Photo;
import com.example.quiz.entity.PhotoData;
import com.example.quiz.entity.PhotoTemp;
import com.example.quiz.entity.User;
import com.example.quiz.exception.AppException;
import com.example.quiz.exception.ErrorCode;
import com.example.quiz.mapper.PhotoMapper;
import com.example.quiz.repository.PhotoRepository;
import com.example.quiz.repository.PhotoTempRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PhotoService extends BaseAuthedService {

    private final PhotoRepository repo;
    @Autowired
    private PhotoMapper photoMapper;
    @Autowired
    private PhotoTempRepository photoTempRepository;
    @Transactional(rollbackFor = Exception.class)
    public List<PhotoResponse> upload(List<MultipartFile> files) {
        String currentUserId = getCurrentUserId();
        return files.stream().map(item -> {
            try {
                Photo photo = save(item);
                PhotoTemp temp = PhotoTemp.builder().photo(photo).build();
                photoTempRepository.save(temp);
                return photoMapper.toResponse(photo);
            } catch (IOException e) {
                throw new RuntimeException("Không thể lưu ảnh");
            }
        }).toList();
    }

    @Transactional
    public Photo save(MultipartFile file) throws IOException {
        Photo img = Photo.builder()
            .uploadedBy(getCurrentUserId())
            .data(PhotoData.builder()
                .fileName(file.getOriginalFilename())
                .contentType(file.getContentType())
                .data(file.getBytes())
                .build())
            .build();
        return repo.save(img);
    }

    public Photo load(String id) {
        return repo.findById(id)
            .orElseThrow(() -> new AppException(ErrorCode.PHOTO_NOT_EXISTED));
    }

    @Transactional
    public void delete(String id) {
        User user = getCurrentUser();
        Photo photo = repo.findById(id)
            .orElseThrow(() -> new AppException(ErrorCode.PHOTO_NOT_EXISTED));
        if (photo.getUploadedBy() != null && !photo.getUploadedBy().equals(user.getId()))
            throw new AppException(ErrorCode.UNAUTHORIZE);
        repo.delete(photo);
    }

    public Photo copy(Photo photo) {
        if (photo == null) return null;
        Photo newPhoto = photoMapper.clone(photo);
        newPhoto.setId(null);
        if (photo.getData() != null) {
            PhotoData photoData = photoMapper.clone(photo.getData());
            photoData.setId(null);
            newPhoto.setData(photoData);
        }
        return newPhoto;
    }
}