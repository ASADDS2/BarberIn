/**
 * Validation Utility Class
 * Provides validation methods for common data types used throughout the application.
 * All methods return boolean values indicating whether the input is valid or not.
 */

/**
 * Validators class
 * Contains static methods for validating different types of data
 */
class Validators {
    
    /**
     * Validates email format using regex pattern
     * @param {string} email - Email address to validate
     * @returns {boolean} True if email format is valid, false otherwise
     */
    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Validates phone number format and length
     * @param {string} phone - Phone number to validate
     * @returns {boolean} True if phone number is valid (minimum 10 characters), false otherwise
     */
    static isValidPhone(phone) {
        const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
        return phoneRegex.test(phone) && phone.length >= 10;
    }

    /**
     * Validates password strength (minimum length requirement)
     * @param {string} password - Password to validate
     * @returns {boolean} True if password meets minimum length requirement (6 characters), false otherwise
     */
    static isValidPassword(password) {
        return password && password.length >= 6;
    }

    /**
     * Validates rating value (must be integer between 1 and 5)
     * @param {number} rating - Rating value to validate
     * @returns {boolean} True if rating is valid (1-5 integer), false otherwise
     */
    static isValidRating(rating) {
        return rating >= 1 && rating <= 5 && Number.isInteger(rating);
    }

    /**
     * Validates date string and ensures it's not in the past
     * @param {string} dateString - Date string to validate
     * @returns {boolean} True if date is valid and not in the past, false otherwise
     */
    static isValidDate(dateString) {
        const date = new Date(dateString);
        return date instanceof Date && !isNaN(date.getTime()) && date >= new Date().setHours(0, 0, 0, 0);
    }

    /**
     * Validates time string format (HH:MM)
     * @param {string} timeString - Time string to validate
     * @returns {boolean} True if time format is valid (HH:MM), false otherwise
     */
    static isValidTime(timeString) {
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        return timeRegex.test(timeString);
    }

    /**
     * Sanitizes string input by removing potentially dangerous characters
     * @param {string} str - String to sanitize
     * @returns {string} Sanitized string with HTML tags removed
     */
    static sanitizeString(str) {
        if (typeof str !== 'string') return '';
        return str.trim().replace(/[<>]/g, '');
    }
}

// Export the Validators class for use throughout the application
export default Validators;
