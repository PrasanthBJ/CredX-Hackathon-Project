package com.credx.campusportal.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Object> handleResourceNotFoundException(ResourceNotFoundException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("message", ex.getMessage());
        body.put("status", HttpStatus.NOT_FOUND.value());
        return new ResponseEntity<>(body, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler({DuplicateApplicationException.class, InvalidStateTransitionException.class})
    public ResponseEntity<Object> handleBadRequestExceptions(RuntimeException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("message", ex.getMessage());
        body.put("status", HttpStatus.BAD_REQUEST.value());
        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Object> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", HttpStatus.BAD_REQUEST.value());

        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        body.put("errors", errors);

        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(org.springframework.http.converter.HttpMessageNotReadableException.class)
    public ResponseEntity<Object> handleHttpMessageNotReadableException(org.springframework.http.converter.HttpMessageNotReadableException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", HttpStatus.BAD_REQUEST.value());
        
        String message = "Invalid request body.";
        Throwable cause = ex.getCause();
        if (cause != null && cause.getClass().getName().endsWith("InvalidFormatException")) {
            try {
                java.lang.reflect.Method getTargetType = cause.getClass().getMethod("getTargetType");
                Class<?> targetType = (Class<?>) getTargetType.invoke(cause);
                if (targetType != null && targetType.isEnum()) {
                    java.lang.reflect.Method getPath = cause.getClass().getMethod("getPath");
                    java.util.List<?> path = (java.util.List<?>) getPath.invoke(cause);
                    String fieldName = "field";
                    if (path != null && !path.isEmpty()) {
                        Object pathElement = path.get(0);
                        java.lang.reflect.Method getFieldName = pathElement.getClass().getMethod("getFieldName");
                        fieldName = (String) getFieldName.invoke(pathElement);
                    }
                    message = "Invalid value for field '" + fieldName + 
                              "'. Accepted values are: " + java.util.Arrays.toString(targetType.getEnumConstants());
                } else {
                    message = ex.getMostSpecificCause().getMessage();
                }
            } catch (Exception refEx) {
                message = ex.getMostSpecificCause().getMessage();
            }
        } else {
            message = ex.getMostSpecificCause().getMessage();
        }
        
        body.put("message", message);
        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleGlobalException(Exception ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("message", "An unexpected error occurred: " + ex.getMessage());
        body.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
        return new ResponseEntity<>(body, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
