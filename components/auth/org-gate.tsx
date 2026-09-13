"use client";

import React, { useEffect, useRef } from "react";
import { useAuth, OrganizationSwitcher, useUser } from "@clerk/nextjs";
import posthog from "posthog-js";
import { Building2 } from "lucide-react";

interface OrgGateProps {
  children: React.ReactNode;
}

/**
 * Ensures user is part of an active Organization before accessing TURIA practice modules.
 */
export function OrgGate({ children }: OrgGateProps) {
  const { isLoaded, isSignedIn, orgId } = useAuth();
  const { user } = useUser();
  const identifiedUserId = useRef<string | null>(null);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user?.id || !posthog.__loaded) return;

    if (identifiedUserId.current && identifiedUserId.current !== user.id) {
      posthog.reset();
    }

    if (identifiedUserId.current !== user.id) {
      posthog.identify(user.id, {
        email: user.primaryEmailAddress?.emailAddress,
        name: user.fullName,
      });
      identifiedUserId.current = user.id;
    }
  }, [isLoaded, isSignedIn, user?.fullName, user?.id, user?.primaryEmailAddress?.emailAddress]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin size-6 border-2 border-indigo-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  // If signed in but no active organization is selected
  if (isSignedIn && !orgId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 shadow-xl p-6 text-center space-y-5 animate-in zoom-in-95 duration-150">
          <div className="size-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mx-auto">
            <Building2 className="size-7" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-lg font-bold text-slate-900">Select or Create Your CA Firm Workspace</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              TURIA is a multi-tenant practice operating system. To access clients, compliance workflows, and statutory registries, please create or select your Firm Organization.
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl space-y-3">
            <span className="text-[11px] font-semibold text-slate-700 block">
              Active Organization Required
            </span>
            <div className="flex justify-center">
              <OrganizationSwitcher
                hidePersonal={false}
                afterCreateOrganizationUrl="/"
                afterSelectOrganizationUrl="/"
                appearance={{
                  elements: {
                    rootBox: "w-full flex justify-center",
                    organizationSwitcherTrigger: "px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl font-semibold text-xs shadow-xs transition-colors",
                  },
                }}
              />
            </div>
          </div>

          <p className="text-[10px] text-slate-400">
            Need help? Contact your firm managing partner or administrator.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
