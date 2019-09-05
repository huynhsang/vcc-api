class ValidationUtils {
    constructor () {
        this.MIN_LENGTH = 8;
        this.MAX_LENGTH = 48;
        this.MIN_USERNAME_LENGTH = 8;
        this.MAX_USERNAME_LENGTH = 24;

        this.USERNAME_REGEX = /^[A-Za-z0-9]+(?:[_-][A-Za-z0-9]+)*$/;
        this.PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
        this.FULLNAME_REGEX = /^[a-zA-Z\\s]+/;
        this.SLUG_REGEX = /^[a-z0-9-]+$/;
    }

}

const validationUtils = new ValidationUtils();
export default validationUtils;

