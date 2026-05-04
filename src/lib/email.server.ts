import nodemailer from 'nodemailer';

const transport = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

function wrapEmailContent(innerBody: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FundedNG</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background-color: #0f0f0f; font-family: Arial, sans-serif; }
    .email-container { max-width: 600px; margin: 0 auto; background-color: #111827; border-radius: 12px; overflow: hidden; }
    .header { background-color: #111827; padding: 32px; text-align: center; }
    .logo { width: 180px; height: auto; }
    .divider { border-top: 3px solid #16A34A; }
    .body-content { padding: 32px; color: #ffffff; font-family: Arial, sans-serif; }
    .body-content p { line-height: 1.6; margin-bottom: 16px; }
    .body-content ul, .body-content ol { margin-left: 20px; margin-bottom: 16px; color: #ffffff; }
    .body-content li { margin-bottom: 8px; }
    .secondary-text { color: #9CA3AF; }
    .info-box { background-color: #1F2937; border-radius: 8px; padding: 20px; border-left: 4px solid #16A34A; margin: 16px 0; }
    .info-box h3 { margin-bottom: 12px; color: #ffffff; }
    .info-box p { margin-bottom: 8px; }
    .cta-button { display: inline-block; background-color: #16A34A; color: #000000; font-weight: bold; border-radius: 8px; padding: 14px 32px; text-decoration: none; margin: 16px 0; }
    .tagline { color: #16A34A; font-style: italic; text-align: center; padding: 20px 32px; font-family: Arial, sans-serif; }
    .footer { background-color: #0a0a0a; padding: 24px; text-align: center; color: #6B7280; font-size: 12px; font-family: Arial, sans-serif; }
    h1, h2, h3, h4 { color: #ffffff; font-family: Arial, sans-serif; margin-bottom: 16px; }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <img src="https://fundedng.fun/logo.png" alt="FundedNG Logo" class="logo">
    </div>
    <div class="divider"></div>
    <div class="body-content">
      ${innerBody}
    </div>
    <div class="tagline">If You Sabi Trade, We Sabi Pay. 🇳🇬</div>
    <div class="footer">
      FundedNG · Nigeria's Prop Trading Firm · fundedng.fun · support@fundedng.fun
    </div>
  </div>
</body>
</html>`;
}

export function sendWelcomeEmail(email: string, firstName: string) {
  const subject = 'Welcome to FundedNG 🇳🇬 — Trade Big. Get Paid.';
  const innerBody = `
    <p>Hi ${firstName},</p>
    <p>Welcome to FundedNG — The Best Prop Firm for 9ja Traders wey sabi trade.</p>
    <p>Your account has been created successfully. You're now part of a growing community of Nigerian traders getting funded and getting paid.</p>
    <p>Here's what you can do next:</p>
    <ul>
      <li>Browse our challenge accounts starting from ₦7,500</li>
      <li>Pick a challenge that fits your trading style</li>
      <li>Pass the evaluation and get funded</li>
    </ul>
    <p>No dollar stress. No complicated rules. Just 3 fair rules and you're good to go.</p>
    <a href="https://fundedng.fun/buy" class="cta-button">GET STARTED →</a>
  `;
  transport.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject,
    html: wrapEmailContent(innerBody),
  }).catch(err => console.error('Welcome email failed:', err));
}

export function sendPurchaseConfirmedEmail(email: string, firstName: string, challengeName: string, accountSize: number, amountPaid: number, orderId: string) {
  const subject = 'Challenge Purchase Confirmed ✅ — FundedNG';
  const innerBody = `
    <p>Hi ${firstName},</p>
    <p>Your challenge purchase has been confirmed! 🎉</p>
    <div class="info-box">
      <h3>ORDER DETAILS</h3>
      <p>Challenge: ${challengeName}</p>
      <p>Account Size: ₦${accountSize.toLocaleString()}</p>
      <p>Amount Paid: ₦${amountPaid.toLocaleString()}</p>
      <p>Order ID: ${orderId}</p>
    </div>
    <p>What happens next?</p>
    <p>Your MT5 account credentials will be delivered to this email within 5mins. Keep an eye on your inbox.</p>
    <p>Once you receive your login details, log in to MT5 and start trading toward your profit target.</p>
    <a href="https://fundedng.fun/dashboard" class="cta-button">VIEW DASHBOARD →</a>
  `;
  transport.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject,
    html: wrapEmailContent(innerBody),
  }).catch(err => console.error('Purchase confirmed email failed:', err));
}

export function sendAccountDeliveredEmail(email: string, firstName: string, mt5Login: string, mt5Password: string, mt5Server: string, investorPassword: string, challengeName: string, profitTarget: number, maxDailyDD: number, maxTotalDD: number) {
  const subject = 'Your MT5 Account is Ready 🎉 — Login Details Inside';
  const innerBody = `
    <p>Hi ${firstName},</p>
    <p>Your FundedNG trading account is ready! Here are your login details:</p>
    <div class="info-box">
      <h3>MT5 LOGIN DETAILS</h3>
      <p>Login: ${mt5Login}</p>
      <p>Password: ${mt5Password}</p>
      <p>Server: ${mt5Server}</p>
      <p>Investor Password: ${investorPassword}</p>
      <p>Challenge: ${challengeName}</p>
    </div>
    <p>⚠️ PLEASE CHANGE YOUR PASSWORD IMMEDIATELY. WE WILL NOT BE RESPONSIBLE FOR ANY UNAUTHORISED TRADES ON YOUR ACCOUNT.</p>
    <p>YOUR CHALLENGE RULES</p>
    <ul>
      <li>Profit Target: ${profitTarget}%</li>
      <li>Max Daily Drawdown: ${maxDailyDD}%</li>
      <li>Max Total Drawdown: ${maxTotalDD}%</li>
      <li>Min Trade Duration: 3 minutes (no scalping)</li>
      <li>No holding trades over weekends</li>
    </ul>
    <a href="https://fundedng.fun/rules" class="cta-button">HOW TO LOGIN →</a>
    <p>Good luck trader! We're rooting for you. 💪</p>
  `;
  transport.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject,
    html: wrapEmailContent(innerBody),
  }).catch(err => console.error('Account delivered email failed:', err));
}

export function sendPhase1PassedEmail(email: string, firstName: string, accountSize: number, profitTarget: number, maxDailyDD: number, maxTotalDD: number) {
  const subject = "🏆 Phase 1 Passed — You're Halfway There!";
  const innerBody = `
    <p>Hi ${firstName},</p>
    <p>CONGRATULATIONS! 🎉</p>
    <p>You have successfully passed Phase 1 of your FundedNG challenge. Your trading has been verified and Phase 2 is now active on your dashboard.</p>
    <div class="info-box">
      <h3>PHASE 2 DETAILS</h3>
      <p>Account Size: ₦${accountSize.toLocaleString()}</p>
      <p>Profit Target: ${profitTarget}%</p>
      <p>Max Daily Drawdown: ${maxDailyDD}%</p>
      <p>Max Total Drawdown: ${maxTotalDD}%</p>
    </div>
    <p>Keep the same discipline that got you here. Phase 2 is your final step before becoming a fully funded FundedNG trader.</p>
    <p>Stay focused. Stay consistent. You've got this. 💪</p>
    <a href="https://fundedng.fun/dashboard" class="cta-button">VIEW DASHBOARD →</a>
  `;
  transport.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject,
    html: wrapEmailContent(innerBody),
  }).catch(err => console.error('Phase 1 passed email failed:', err));
}

export function sendFundedEmail(email: string, firstName: string, accountSize: number) {
  const subject = "🎉 You're a Funded Trader! Welcome to the FundedNG Family";
  const innerBody = `
    <p>Hi ${firstName},</p>
    <p>YOU DID IT! 🎊🇳🇬</p>
    <p>You have successfully passed all evaluation phases and are now a fully funded FundedNG trader. Your funded account is now active.</p>
    <div class="info-box">
      <h3>FUNDED ACCOUNT DETAILS</h3>
      <p>Account Size: ₦${accountSize.toLocaleString()}</p>
      <p>Profit Split: 80% in your favour</p>
      <p>First Payout: Available after 10% KYC withdrawal</p>
      <p>Payout Schedule: Every 7 days</p>
    </div>
    <p>HOW TO REQUEST A PAYOUT</p>
    <ol>
      <li>Log in to your dashboard</li>
      <li>Go to the Payouts tab</li>
      <li>Enter your bank details and amount</li>
      <li>We process within 24hrs</li>
    </ol>
    <p>Trade well and get paid. You've earned it. 🏆</p>
    <a href="https://fundedng.fun/dashboard" class="cta-button">VIEW DASHBOARD →</a>
  `;
  transport.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject,
    html: wrapEmailContent(innerBody),
  }).catch(err => console.error('Funded email failed:', err));
}

export function sendPayoutRequestedEmail(email: string, firstName: string, amount: number, paymentMethod: string, requestDate: string) {
  const subject = "Payout Request Received 💸 — FundedNG";
  const innerBody = `
    <p>Hi ${firstName},</p>
    <p>We have received your payout request. Here are the details:</p>
    <div class="info-box">
      <h3>PAYOUT DETAILS</h3>
      <p>Amount Requested: ₦${amount.toLocaleString()}</p>
      <p>Payment Method: ${paymentMethod}</p>
      <p>Request Date: ${requestDate}</p>
      <p>Processing Time: 24hrs</p>
    </div>
    <p>Our team will review and process your payout within 24hrs. You will receive a confirmation email once payment has been sent.</p>
    <p>If you have any questions contact us at <a href="mailto:support@fundedng.fun" style="color: #16A34A;">support@fundedng.fun</a></p>
    <a href="https://fundedng.fun/dashboard" class="cta-button">VIEW DASHBOARD →</a>
  `;
  transport.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject,
    html: wrapEmailContent(innerBody),
  }).catch(err => console.error('Payout requested email failed:', err));
}

export function sendPayoutApprovedEmail(email: string, firstName: string, amount: number, paymentMethod: string) {
  const subject = "✅ Payout Approved — Payment On Its Way!";
  const innerBody = `
    <p>Hi ${firstName},</p>
    <p>Great news! Your payout has been approved and payment is on its way. 🎉</p>
    <div class="info-box">
      <h3>PAYMENT DETAILS</h3>
      <p>Amount Approved: ₦${amount.toLocaleString()}</p>
      <p>Payment Method: ${paymentMethod}</p>
      <p>Expected Arrival: 24hrs</p>
    </div>
    <p>Once you receive your payment, we'd love for you to share your experience with the trading community. Your success story inspires other Nigerian traders! 🇳🇬</p>
    <p>Ready to keep trading? Your account balance has been reset and you can continue toward your next payout.</p>
    <a href="https://fundedng.fun/dashboard" class="cta-button">VIEW DASHBOARD →</a>
  `;
  transport.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject,
    html: wrapEmailContent(innerBody),
  }).catch(err => console.error('Payout approved email failed:', err));
}

export function sendPayoutRejectedEmail(email: string, firstName: string, reason: string) {
  const subject = "Payout Request Update — Action Required";
  const innerBody = `
    <p>Hi ${firstName},</p>
    <p>We have reviewed your payout request and unfortunately it cannot be processed at this time.</p>
    <div class="info-box">
      <h3>REASON</h3>
      <p>${reason}</p>
    </div>
    <p>Common reasons for payout rejection include:</p>
    <ul>
      <li>Incomplete KYC verification</li>
      <li>Bank details mismatch</li>
      <li>Minimum payout amount not reached</li>
      <li>Outstanding rule violations</li>
    </ul>
    <p>If you believe this is an error or need clarification, please contact us at <a href="mailto:support@fundedng.fun" style="color: #16A34A;">support@fundedng.fun</a> and we will resolve it promptly.</p>
    <a href="https://fundedng.fun/dashboard" class="cta-button">VIEW DASHBOARD →</a>
  `;
  transport.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject,
    html: wrapEmailContent(innerBody),
  }).catch(err => console.error('Payout rejected email failed:', err));
}

export function sendAccountBreachedEmail(email: string, firstName: string, breachReason: string, breachDate: string) {
  const subject = "Account Update — Challenge Ended";
  const innerBody = `
    <p>Hi ${firstName},</p>
    <p>We regret to inform you that your FundedNG challenge account has been terminated.</p>
    <div class="info-box">
      <h3>BREACH DETAILS</h3>
      <p>Reason: ${breachReason}</p>
      <p>Date: ${breachDate}</p>
    </div>
    <p>Every great trader faces setbacks. What separates the best is how they respond. Review what happened, adjust your strategy and come back stronger.</p>
    <p>Ready to try again? Use code RETRY20 for 20% off your next challenge.</p>
    <a href="https://fundedng.fun/buy" class="cta-button">START FRESH →</a>
  `;
  transport.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject,
    html: wrapEmailContent(innerBody),
  }).catch(err => console.error('Account breached email failed:', err));
}

export function sendKycApprovedEmail(email: string, firstName: string) {
  const subject = "Identity Verified ✅ — You're Now Eligible for Payouts";
  const innerBody = `
    <p>Hi ${firstName},</p>
    <p>Your identity has been successfully verified! ✅</p>
    <p>You are now fully KYC verified on FundedNG which means:</p>
    <ul>
      <li>You can request payouts from your funded account</li>
      <li>Your account has full withdrawal privileges</li>
      <li>You're part of our verified trader community</li>
    </ul>
    <p>To request your first payout simply log in to your dashboard and go to the Payouts tab.</p>
    <a href="https://fundedng.fun/dashboard" class="cta-button">VIEW DASHBOARD →</a>
  `;
  transport.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject,
    html: wrapEmailContent(innerBody),
  }).catch(err => console.error('KYC approved email failed:', err));
}
