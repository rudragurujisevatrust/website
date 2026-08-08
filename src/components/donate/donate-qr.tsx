"use client";

import { Check, Copy, Smartphone } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Builds a UPI deep link (`upi://pay?...`). Any Indian UPI app — GPay, PhonePe,
 * Paytm, BHIM — can scan or open it. Amount is optional; leaving it out lets
 * the donor choose.
 *
 * Note the payee name and note stay in Latin script regardless of locale:
 * they are matched against the registered UPI handle by the payment network.
 */
function buildUpiUri(amount?: number) {
  const params = new URLSearchParams({
    pa: siteConfig.upi.vpa,
    pn: siteConfig.upi.payeeName,
    cu: siteConfig.upi.currency,
    tn: "Seva Donation",
  });
  if (amount && amount > 0) params.set("am", String(amount));
  return `upi://pay?${params.toString()}`;
}

const SUGGESTED_AMOUNTS = [501, 1100, 2500, 5000];

export function DonateQR({
  strings,
  className,
}: {
  strings: Dictionary["donate"];
  className?: string;
}) {
  const [amount, setAmount] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const upiUri = buildUpiUri(amount ?? undefined);

  const copyVpa = async () => {
    try {
      await navigator.clipboard.writeText(siteConfig.upi.vpa);
      setCopied(true);
      toast.success(strings.copied);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error(strings.copyFailed);
    }
  };

  return (
    <div className={cn("flex flex-col items-center gap-6", className)}>
      {/* QR plate, framed like a temple niche. */}
      <div className="relative rounded-2xl border-4 border-gold/60 bg-white p-5 shadow-lg">
        <div
          aria-hidden
          className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-saffron px-3 py-0.5 text-center font-heading text-xs tracking-wider whitespace-nowrap text-white uppercase"
        >
          {strings.scanToGive}
        </div>
        <QRCodeSVG
          value={upiUri}
          size={216}
          level="M"
          marginSize={0}
          bgColor="#ffffff"
          fgColor="#5c1f14"
          title={`${strings.scanToGive} — ${siteConfig.upi.payeeName}`}
        />
      </div>

      {/* Amount presets — regenerate the QR with the amount pre-filled. */}
      <div className="w-full max-w-sm">
        <p className="mb-2 text-center text-xs tracking-wide text-muted-foreground uppercase">
          {strings.chooseAmount}
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            aria-pressed={amount === null}
            onClick={() => setAmount(null)}
            className={cn(
              "rounded-full border-gold/40",
              amount === null && "border-transparent bg-saffron text-white",
            )}
          >
            {strings.anyAmount}
          </Button>
          {SUGGESTED_AMOUNTS.map((value) => (
            <Button
              key={value}
              type="button"
              variant="outline"
              size="sm"
              aria-pressed={amount === value}
              onClick={() => setAmount(value)}
              className={cn(
                "rounded-full border-gold/40",
                amount === value && "border-transparent bg-saffron text-white",
              )}
            >
              ₹{value.toLocaleString("en-IN")}
            </Button>
          ))}
        </div>
      </div>

      {/* UPI ID with copy, for donors who prefer typing it in. */}
      <div className="flex w-full max-w-sm items-center gap-2 rounded-lg border border-gold/40 bg-card px-3 py-2.5">
        <span className="min-w-0 flex-1">
          <span className="block text-[11px] tracking-wide text-muted-foreground uppercase">
            {strings.upiId}
          </span>
          <span className="block truncate font-mono text-sm text-foreground">
            {siteConfig.upi.vpa}
          </span>
        </span>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={copyVpa}
          aria-label={strings.copyAria}
          className="shrink-0"
        >
          {copied ? (
            <Check className="size-4 text-green-600" />
          ) : (
            <Copy className="size-4" />
          )}
        </Button>
      </div>

      {/* On a phone the QR is useless — open the UPI app directly instead. */}
      <Button
        asChild
        size="lg"
        className="w-full max-w-sm bg-saffron text-white shadow-md hover:bg-saffron-deep sm:hidden"
      >
        <a href={upiUri}>
          <Smartphone className="size-4" />
          {strings.payWithUpi}
        </a>
      </Button>

      <p className="max-w-sm text-center text-xs leading-relaxed text-muted-foreground">
        {strings.note__part1}
        <a
          href={`mailto:${siteConfig.email}`}
          className="text-saffron-deep underline underline-offset-2"
        >
          {siteConfig.email}
        </a>
        .
      </p>
    </div>
  );
}
