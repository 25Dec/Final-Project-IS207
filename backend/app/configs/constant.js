/**
 * Created by SugarTawng 9/11/2022
 */
const DELETED = {
    NO: 0,
    YES: 1
};
module.exports = {
    STATUS_ENUM: ['ACTIVATED', 'DEACTIVATED', 'DELETED', 'WAITING_APPROVE'],
    RELATION_STATUS_ENUM: ['BLOCK', 'BROKEN', 'BAD', 'NORMAL', 'GOOD', 'SWEET', 'EXTREMELY', 'NONE'],
    RELATION_ENUM: ['SUBSCRIBER', 'OWNER', 'AGENT', 'ADVISER', 'SUPERVISOR', 'BROTHER', 'SISTER', 'FATHER', 'SON', 'DAUGHTER', 'MANAGER', 'HOST', 'RENTER', 'NONE'],
    USER_RIGHT_ENUM:['ANONYMOUS', 'END_USER', 'ADMIN', 'SUPER_ADMIN'],
    USER_RIGHT_MANAGER_ENUM: ['ADMIN','SUPER_ADMIN'],
    BOOK_STATUS: ['OLD', 'NEW'],
    DEFAULT_PAGING_SIZE: 100,
    DELETED:['YES', 'NO'],
    CATEGORY: ['Romance', 'Mystery', 'Fantasy & Science fiction', 'Thrillers & Horror', 'Self-help', 'Short Stories', 'Cookbooks', 'Essays', "Essays", 'History', 'Unknown', 'Other']
};
