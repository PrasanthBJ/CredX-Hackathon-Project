import studentService from "./studentService";

export const applicationService = {
    apply: studentService.applyToJobPosting,
    getOwnApplications: studentService.getOwnApplications,
};

export default applicationService;
