package com.example.quiz.validator.none_match_no;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class NoneMatchNoValidator implements ConstraintValidator<NoneMatchNo, List<?>> {

    @Override
    public boolean isValid(List<?> objects, ConstraintValidatorContext context) {
        if (objects == null || objects.isEmpty()) {
            return true; // null hoặc rỗng hợp lệ, nếu muốn bắt buộc thì dùng @NotEmpty
        }

        Set<Integer> noSet = new HashSet<>();

        for (Object obj : objects) {
            try {
                // Kiểm tra xem object có method getNo()
                Method getNoMethod = obj.getClass().getMethod("getNo");
                Object noValue = getNoMethod.invoke(obj);

                if (noValue != null) {
                    Integer no = (Integer) noValue;
                    if (!noSet.add(no)) {
                        // Trùng số, trả về false
                        return false;
                    }
                }
            } catch (NoSuchMethodException | IllegalAccessException | InvocationTargetException ignored) {}
        }

        return true;
    }
}