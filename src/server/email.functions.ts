import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  sendWelcomeEmail,
  sendPurchaseConfirmedEmail,
  sendAccountDeliveredEmail,
  sendPhase1PassedEmail,
  sendFundedEmail,
  sendPayoutApprovedEmail,
  sendPayoutRejectedEmail,
  sendAccountBreachedEmail,
  sendKycApprovedEmail,
} from "@/lib/email.server";

// ---- Welcome Email ----
const WelcomeInput = z.object({
  email: z.string().email(),
  firstName: z.string().min(1),
});

export const sendWelcomeEmailFn = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => WelcomeInput.parse(input))
  .handler(async ({ data }) => {
    sendWelcomeEmail(data.email, data.firstName);
    return { ok: true as const };
  });

// ---- Purchase Confirmed Email ----
const PurchaseConfirmedInput = z.object({
  email: z.string().email(),
  firstName: z.string().min(1),
  challengeName: z.string().min(1),
  accountSize: z.number().positive(),
  amountPaid: z.number().nonnegative(),
  orderId: z.string().min(1),
});

export const sendPurchaseConfirmedEmailFn = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => PurchaseConfirmedInput.parse(input))
  .handler(async ({ data }) => {
    sendPurchaseConfirmedEmail(data.email, data.firstName, data.challengeName, data.accountSize, data.amountPaid, data.orderId);
    return { ok: true as const };
  });

// ---- Account Delivered Email ----
const AccountDeliveredInput = z.object({
  email: z.string().email(),
  firstName: z.string().min(1),
  mt5Login: z.string().min(1),
  mt5Password: z.string().min(1),
  mt5Server: z.string().min(1),
  investorPassword: z.string(),
  challengeName: z.string().min(1),
  profitTarget: z.number().nonnegative(),
  maxDailyDD: z.number().nonnegative(),
  maxTotalDD: z.number().nonnegative(),
});

export const sendAccountDeliveredEmailFn = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => AccountDeliveredInput.parse(input))
  .handler(async ({ data }) => {
    sendAccountDeliveredEmail(data.email, data.firstName, data.mt5Login, data.mt5Password, data.mt5Server, data.investorPassword, data.challengeName, data.profitTarget, data.maxDailyDD, data.maxTotalDD);
    return { ok: true as const };
  });

// ---- Phase 1 Passed Email ----
const Phase1PassedInput = z.object({
  email: z.string().email(),
  firstName: z.string().min(1),
  accountSize: z.number().positive(),
  profitTarget: z.number().nonnegative(),
  maxDailyDD: z.number().nonnegative(),
  maxTotalDD: z.number().nonnegative(),
});

export const sendPhase1PassedEmailFn = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => Phase1PassedInput.parse(input))
  .handler(async ({ data }) => {
    sendPhase1PassedEmail(data.email, data.firstName, data.accountSize, data.profitTarget, data.maxDailyDD, data.maxTotalDD);
    return { ok: true as const };
  });

// ---- Funded Email ----
const FundedInput = z.object({
  email: z.string().email(),
  firstName: z.string().min(1),
  accountSize: z.number().positive(),
});

export const sendFundedEmailFn = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => FundedInput.parse(input))
  .handler(async ({ data }) => {
    sendFundedEmail(data.email, data.firstName, data.accountSize);
    return { ok: true as const };
  });

// ---- Payout Approved Email ----
const PayoutApprovedInput = z.object({
  email: z.string().email(),
  firstName: z.string().min(1),
  amount: z.number().positive(),
  paymentMethod: z.string().min(1),
});

export const sendPayoutApprovedEmailFn = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => PayoutApprovedInput.parse(input))
  .handler(async ({ data }) => {
    sendPayoutApprovedEmail(data.email, data.firstName, data.amount, data.paymentMethod);
    return { ok: true as const };
  });

// ---- Payout Rejected Email ----
const PayoutRejectedInput = z.object({
  email: z.string().email(),
  firstName: z.string().min(1),
  reason: z.string().min(1),
});

export const sendPayoutRejectedEmailFn = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => PayoutRejectedInput.parse(input))
  .handler(async ({ data }) => {
    sendPayoutRejectedEmail(data.email, data.firstName, data.reason);
    return { ok: true as const };
  });

// ---- Account Breached Email ----
const AccountBreachedInput = z.object({
  email: z.string().email(),
  firstName: z.string().min(1),
  breachReason: z.string().min(1),
  breachDate: z.string().min(1),
});

export const sendAccountBreachedEmailFn = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => AccountBreachedInput.parse(input))
  .handler(async ({ data }) => {
    sendAccountBreachedEmail(data.email, data.firstName, data.breachReason, data.breachDate);
    return { ok: true as const };
  });

// ---- KYC Approved Email ----
const KycApprovedInput = z.object({
  email: z.string().email(),
  firstName: z.string().min(1),
});

export const sendKycApprovedEmailFn = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => KycApprovedInput.parse(input))
  .handler(async ({ data }) => {
    sendKycApprovedEmail(data.email, data.firstName);
    return { ok: true as const };
  });
