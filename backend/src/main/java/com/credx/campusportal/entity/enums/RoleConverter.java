package com.credx.campusportal.entity.enums;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class RoleConverter implements AttributeConverter<Role, String> {

    @Override
    public String convertToDatabaseColumn(Role role) {
        if (role == null) {
            return null;
        }
        return "ROLE_" + role.name();
    }

    @Override
    public Role convertToEntityAttribute(String dbData) {
        if (dbData == null) {
            return null;
        }
        if (dbData.startsWith("ROLE_")) {
            return Role.valueOf(dbData.substring(5));
        }
        return Role.valueOf(dbData);
    }
}
