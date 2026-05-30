'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import ReservationModal from '@/components/atmosphere/ReservationModal';

const Ctx = createContext({ open: false, openModal: () => {}, closeModal: () => {} });

export function useReservation() {
  return useContext(Ctx);
}

export function ReservationProvider({ children }) {
  const [open, setOpen] = useState(false);
  const openModal = useCallback(() => setOpen(true), []);
  const closeModal = useCallback(() => setOpen(false), []);
  return (
    <Ctx.Provider value={{ open, openModal, closeModal }}>
      {children}
      <ReservationModal open={open} onClose={closeModal} />
    </Ctx.Provider>
  );
}
