"use client";

import { createContext, useContext } from "react";

type CustomerSessionValue = {
  displayName: string;
  loyaltyPoints: number;
};

const CustomerSessionContext = createContext<CustomerSessionValue | null>(null);

export function CustomerSessionProvider({
  value,
  children,
}: {
  value: CustomerSessionValue;
  children: React.ReactNode;
}) {
  return <CustomerSessionContext.Provider value={value}>{children}</CustomerSessionContext.Provider>;
}

export function useCustomerSession(): CustomerSessionValue {
  const v = useContext(CustomerSessionContext);
  if (!v) {
    throw new Error("CustomerSessionProvider مطلوب حول هذه الصفحة");
  }
  return v;
}
