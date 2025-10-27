import { create } from 'zustand';

type AuthMode = 'login' | 'signup';

interface AuthModalState {
  isOpen: boolean;
  mode: AuthMode;
  actionDescription: string;
  pendingAction: (() => void) | null;
  
  openModal: (mode?: AuthMode, description?: string, action?: () => void) => void;
  closeModal: () => void;
  setMode: (mode: AuthMode) => void;
  completeAction: () => void;
}

export const useAuthModalStore = create<AuthModalState>((set, get) => ({
  isOpen: false,
  mode: 'login',
  actionDescription: '',
  pendingAction: null,
  
  openModal: (mode = 'login', description = '', action) => {
    console.log('🔓 Opening auth modal:', { mode, description });
    set({
      isOpen: true,
      mode,
      actionDescription: description,
      pendingAction: action || null,
    });
  },
  
  closeModal: () => {
    console.log('🔒 Closing auth modal');
    set({
      isOpen: false,
      actionDescription: '',
      pendingAction: null,
    });
  },
  
  setMode: (mode) => {
    console.log('🔄 Switching auth mode to:', mode);
    set({ mode });
  },
  
  completeAction: () => {
    const { pendingAction } = get();
    if (pendingAction) {
      console.log('✅ Executing pending action');
      pendingAction();
    }
    set({
      isOpen: false,
      actionDescription: '',
      pendingAction: null,
    });
  },
}));
