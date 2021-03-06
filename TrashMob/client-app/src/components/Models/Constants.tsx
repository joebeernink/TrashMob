export const RegexPhoneNumber = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im;
export const RegexEmail = /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w -\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i;
export const RegexUserName = "^[a-zA-Z0-9_]*$";

export const PartnerRequestStatusPending = 1;
export const EventPartnerStatusNone = 0;
export const EventPartnerStatusRequested = 1;
export const EventPartnerStatusAccepted = 2;
export const EventPartnerStatusDeclined = 3;

export const MediaTypeInstagram = 1;
export const MediaTypeYouTube = 2;