import { Loading, QSpinnerDots } from 'quasar';

// Configure default loading settings
Loading.setDefaults({
  spinner: QSpinnerDots,
  spinnerColor: 'primary',
  spinnerSize: 80,
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  message: 'Carregando...',
  messageColor: 'primary'
});

// Create a composable for using loading throughout the app
export const useLoading = () => {
  const show = (message = 'Carregando...') => {
    Loading.show({
      message
    });
  };

  const hide = () => {
    Loading.hide();
  };

  return {
    show,
    hide
  };
};

export default ({ app }) => {
  // Make loading available globally
  app.config.globalProperties.$loading = Loading;
};