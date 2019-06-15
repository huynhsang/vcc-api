'use strict';

let message = {};

message.reverificationResponseTitle = 'A Link to reverify your identity ' +
  'has been sent to your email successfully';
message.reverificationResponseContent = 'Please check your email and click ' +
  'on the verification link before logging in';

message.emailVerificationSubject = 'Thanks for registering.';

message.signUpTitleSuccess = 'Signed up successfully';
message.signUpContentSuccess = 'Please check your email and click on the ' +
  'verification link before logging in.';

message.changePasswordResponseTitleSuccess = 'Password changed successfully';
message.changePasswordResponseContentSuccess = 'Please login again with your ' +
  'new password';

message.resetPasswordEmailSubject = 'Password reset';
message.resetPasswordResponseTitleSuccess = 'Password reset success';
message.resetPasswordResponseContentSuccess = 'Your password has been reset ' +
  'successfully';

message.logoutSuccess = 'Logout successfully';

message.sendingPasswordResetToEmailError = '> error sending password reset ' +
  'to email';
message.sendingPasswordResetToEmailSuccess = 'successfully, sent password ' +
  'reset email to:';
message.incorrectBehavior = 'Your behavior is incorrect, please re-check it';
message.somethingWentWrong = 'Something went wrong, please try again later';

// Notification
message.eventSystemNotificationToday = 'There are {0} new events today';
message.dealSystemNotificationToday = 'There are {0} new deals today';
message.articleSystemNotificationToday = 'There are {0} new articles today';

module.exports = message;
