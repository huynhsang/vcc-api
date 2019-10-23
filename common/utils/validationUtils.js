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

function slugify (string) {
    const a = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;';
    const b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnooooooooprrsssssttuuuuuuuuuwxyyzzz------';
    const p = new RegExp(a.split('').join('|'), 'g');

    return string.toString().toLowerCase()
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
        .replace(/&/g, '-and-') // Replace & with 'and'
        .replace(/[^\w\-]+/g, '') // Remove all non-word characters
        .replace(/\-\-+/g, '-') // Replace multiple - with single -
        .replace(/^-+/, '') // Trim - from start of text
        .replace(/-+$/, ''); // Trim - from end of text
}

export {slugify};
