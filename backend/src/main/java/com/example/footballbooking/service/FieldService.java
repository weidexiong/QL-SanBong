package com.example.footballbooking.service;

import com.example.footballbooking.dto.request.FieldCreateRequest;
import com.example.footballbooking.dto.request.FieldUpdateRequest;
import com.example.footballbooking.dto.response.FieldResponseDto;
import com.example.footballbooking.dto.response.PageResponseDto;
import com.example.footballbooking.entity.*;
import com.example.footballbooking.exception.ForbiddenException;
import com.example.footballbooking.exception.ResourceNotFoundException;
import com.example.footballbooking.mapper.FieldMapper;
import com.example.footballbooking.repository.FacilityRepository;
import com.example.footballbooking.repository.FieldSpecification;
import com.example.footballbooking.repository.FootballFieldRepository;
import com.example.footballbooking.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

// Dịch vụ quản lý sân bóng đá cho khách hàng, chủ sân và quản trị viên
@Service
@RequiredArgsConstructor
public class FieldService {

    private final FootballFieldRepository fieldRepository;
    private final FacilityRepository facilityRepository;
    private final UserRepository userRepository;

    // Tìm kiếm sân bóng công khai cho khách hàng (chỉ hiển thị sân ACTIVE)
    @Transactional(readOnly = true)
    public PageResponseDto<FieldResponseDto> searchActiveFields(
            String keyword,
            String city,
            String district,
            FieldType fieldType,
            Long minPrice,
            Long maxPrice,
            int page,
            int size,
            String sortBy,
            String sortDir
    ) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Specification<FootballField> spec = FieldSpecification.filterFields(
                keyword, city, district, fieldType, minPrice, maxPrice, FieldStatus.ACTIVE
        );

        Page<FootballField> fieldPage = fieldRepository.findAll(spec, pageable);
        List<FieldResponseDto> dtos = fieldPage.getContent().stream()
                .map(FieldMapper::toDto)
                .collect(Collectors.toList());

        return PageResponseDto.<FieldResponseDto>builder()
                .content(dtos)
                .pageNumber(fieldPage.getNumber())
                .pageSize(fieldPage.getSize())
                .totalElements(fieldPage.getTotalElements())
                .totalPages(fieldPage.getTotalPages())
                .isLast(fieldPage.isLast())
                .build();
    }

    // Lấy chi tiết một sân bóng theo ID
    @Transactional(readOnly = true)
    public FieldResponseDto getFieldById(Long id) {
        FootballField field = fieldRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sân bóng với mã: " + id));
        return FieldMapper.toDto(field);
    }

    // Chủ sân tạo mới sân bóng (trạng thái ban đầu là PENDING_APPROVAL)
    @Transactional
    public FieldResponseDto createFieldByOwner(String ownerEmail, FieldCreateRequest request) {
        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy thông tin chủ sân"));

        // Chỉ chủ sân đã được duyệt (ACTIVE) mới được phép đưa sân mới lên hệ thống
        if (owner.getStatus() != UserStatus.ACTIVE) {
            throw new ForbiddenException("Tài khoản chủ sân của bạn đang chờ phê duyệt hoặc đã bị khóa.");
        }

        Set<Facility> facilities = new HashSet<>();
        if (request.getFacilityIds() != null && !request.getFacilityIds().isEmpty()) {
            facilities.addAll(facilityRepository.findAllById(request.getFacilityIds()));
        }

        FootballField field = FootballField.builder()
                .owner(owner)
                .name(request.getName().trim())
                .description(request.getDescription())
                .address(request.getAddress().trim())
                .district(request.getDistrict().trim())
                .city(request.getCity().trim())
                .fieldType(request.getFieldType())
                .basePrice(request.getBasePrice())
                .status(FieldStatus.PENDING_APPROVAL)
                .facilities(facilities)
                .bankName(request.getBankName() != null ? request.getBankName().trim() : null)
                .bankAccountNumber(request.getBankAccountNumber() != null ? request.getBankAccountNumber().trim() : null)
                .bankAccountName(request.getBankAccountName() != null ? request.getBankAccountName().trim().toUpperCase() : null)
                .build();

        // Thêm hình ảnh nếu có
        if (request.getImageUrls() != null) {
            boolean isFirst = true;
            for (String imgUrl : request.getImageUrls()) {
                field.addImage(FieldImage.builder()
                        .imageUrl(imgUrl)
                        .isPrimary(isFirst)
                        .build());
                isFirst = false;
            }
        }

        FootballField savedField = fieldRepository.save(field);
        return FieldMapper.toDto(savedField);
    }

    // Chủ sân cập nhật thông tin sân bóng của chính mình
    @Transactional
    public FieldResponseDto updateFieldByOwner(String ownerEmail, Long fieldId, FieldUpdateRequest request) {
        FootballField field = fieldRepository.findById(fieldId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sân bóng"));

        // Kiểm tra quyền sở hữu: chủ sân chỉ được sửa sân của chính mình
        if (!field.getOwner().getEmail().equals(ownerEmail)) {
            throw new ForbiddenException("Bạn không có quyền chỉnh sửa sân bóng này");
        }

        field.setName(request.getName().trim());
        field.setDescription(request.getDescription());
        field.setAddress(request.getAddress().trim());
        field.setDistrict(request.getDistrict().trim());
        field.setCity(request.getCity().trim());
        field.setFieldType(request.getFieldType());
        field.setBasePrice(request.getBasePrice());

        if (request.getBankName() != null) {
            field.setBankName(request.getBankName().trim());
        }
        if (request.getBankAccountNumber() != null) {
            field.setBankAccountNumber(request.getBankAccountNumber().trim());
        }
        if (request.getBankAccountName() != null) {
            field.setBankAccountName(request.getBankAccountName().trim().toUpperCase());
        }

        if (request.getFacilityIds() != null) {
            Set<Facility> newFacilities = new HashSet<>(facilityRepository.findAllById(request.getFacilityIds()));
            field.setFacilities(newFacilities);
        }

        if (request.getImageUrls() != null) {
            field.getImages().clear();
            boolean isFirst = true;
            for (String imgUrl : request.getImageUrls()) {
                field.addImage(FieldImage.builder()
                        .imageUrl(imgUrl)
                        .isPrimary(isFirst)
                        .build());
                isFirst = false;
            }
        }

        FootballField updatedField = fieldRepository.save(field);
        return FieldMapper.toDto(updatedField);
    }

    // Chủ sân xóa sân bóng của chính mình
    @Transactional
    public void deleteFieldByOwner(String ownerEmail, Long fieldId) {
        FootballField field = fieldRepository.findById(fieldId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sân bóng"));

        if (!field.getOwner().getEmail().equals(ownerEmail)) {
            throw new ForbiddenException("Bạn không có quyền xóa sân bóng này");
        }

        fieldRepository.delete(field);
    }

    // Danh sách sân bóng của một chủ sân
    @Transactional(readOnly = true)
    public List<FieldResponseDto> getFieldsByOwner(String ownerEmail) {
        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy chủ sân"));

        return fieldRepository.findByOwnerId(owner.getId()).stream()
                .map(FieldMapper::toDto)
                .collect(Collectors.toList());
    }

    // Quản trị viên duyệt sân bóng
    @Transactional
    public FieldResponseDto approveField(Long fieldId) {
        FootballField field = fieldRepository.findById(fieldId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sân bóng"));
        field.setStatus(FieldStatus.ACTIVE);
        return FieldMapper.toDto(fieldRepository.save(field));
    }

    // Quản trị viên từ chối duyệt sân bóng
    @Transactional
    public FieldResponseDto rejectField(Long fieldId) {
        FootballField field = fieldRepository.findById(fieldId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sân bóng"));
        field.setStatus(FieldStatus.REJECTED);
        return FieldMapper.toDto(fieldRepository.save(field));
    }

    // Quản trị viên xem tất cả sân bóng (kèm phân trang)
    @Transactional(readOnly = true)
    public PageResponseDto<FieldResponseDto> getAllFieldsForAdmin(FieldStatus status, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<FootballField> fieldPage = (status != null) ?
                fieldRepository.findByStatus(status, pageable) :
                fieldRepository.findAll(pageable);

        List<FieldResponseDto> dtos = fieldPage.getContent().stream()
                .map(FieldMapper::toDto)
                .collect(Collectors.toList());

        return PageResponseDto.<FieldResponseDto>builder()
                .content(dtos)
                .pageNumber(fieldPage.getNumber())
                .pageSize(fieldPage.getSize())
                .totalElements(fieldPage.getTotalElements())
                .totalPages(fieldPage.getTotalPages())
                .isLast(fieldPage.isLast())
                .build();
    }
}
