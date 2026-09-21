package com.example.footballbooking.dto.request;

import com.example.footballbooking.entity.FieldStatus;
import com.example.footballbooking.entity.FieldType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

// DTO yêu cầu cập nhật thông tin sân bóng
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FieldUpdateRequest {

    @NotBlank(message = "Tên sân bóng không được để trống")
    @Size(max = 150, message = "Tên sân không được vượt quá 150 ký tự")
    private String name;

    private String description;

    @NotBlank(message = "Địa chỉ chi tiết không được để trống")
    private String address;

    @NotBlank(message = "Quận/Huyện không được để trống")
    private String district;

    @NotBlank(message = "Tỉnh/Thành phố không được để trống")
    private String city;

    @NotNull(message = "Vui lòng chọn loại sân")
    private FieldType fieldType;

    @NotNull(message = "Giá thuê cơ bản không được để trống")
    @Min(value = 10000, message = "Giá thuê cơ bản tối thiểu là 10.000 VNĐ")
    private Long basePrice;

    private FieldStatus status;
    private List<Long> facilityIds;
    private List<String> imageUrls;

    // Thông tin tài khoản ngân hàng của chủ sân nhận tiền cho cụm sân này
    private String bankName;
    private String bankAccountNumber;
    private String bankAccountName;
}
