package com.example.quiz.helper;

import org.springframework.util.CollectionUtils;

import java.io.*;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;

public class DataUtil {
    public static Date plusSeconds(Date date, long seconds) {
        if (date == null) return null;
        Instant instant = date.toInstant();
        Instant newInstant = instant.plusSeconds(seconds);
        return Date.from(newInstant);
    }

    public static boolean boolValue(Boolean b) {
        return b != null && b;
    }

    public static LocalDateTime toLocalDateTime(Instant instant) {
        return LocalDateTime.ofInstant(instant, ZoneId.systemDefault());
    }

    public static LocalDateTime toLocalDateTime(Object object, String pattern) {
        return toLocalDateTime(String.valueOf(object), pattern);
    }

    public static LocalDateTime toLocalDateTime(String str, String pattern) {
        if (str == null || str.isBlank()) {
            return null;
        }
        if (pattern == null || pattern.isBlank()) {
            return null;
        }
        if (str.length() > pattern.length())
            str = str.substring(0, pattern.length());
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern(pattern);
            return LocalDateTime.parse(str, formatter);
        } catch (Exception ignored) {}
        return null;
    }

    public static <T> List<T> diffsBetween(List<T> list1, List<T> list2) {
        Set<T> set1 = list1 == null ? new HashSet<>() : new HashSet<>(list1);
        Set<T> set2 = list2 == null ? new HashSet<>() : new HashSet<>(list2);

        Set<T> diff = new HashSet<>(set1);
        diff.removeAll(set2);

        Set<T> diff2 = new HashSet<>(set2);
        diff2.removeAll(set1);

        diff.addAll(diff2);

        return new ArrayList<>(diff);
    }
}
