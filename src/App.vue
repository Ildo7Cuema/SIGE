<template>
  <router-view v-slot="{ Component }">
    <transition
      appear
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
    >
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<script>
import { defineComponent, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';

export default defineComponent({
  name: 'App',
  
  setup() {
    const $q = useQuasar();
    const router = useRouter();
    let routeGuard;

    onMounted(() => {
      routeGuard = router.beforeEach((to, from, next) => {
        $q.loading.show({
          message: 'Carregando...',
          spinnerColor: 'primary',
          spinnerSize: 80,
          backgroundColor: 'rgba(255, 255, 255, 0.8)'
        });
        next();
      });

      router.afterEach(() => {
        // Small delay to ensure components are mounted
        setTimeout(() => {
          $q.loading.hide();
        }, 300);
      });
    });

    onUnmounted(() => {
      if (routeGuard) {
        routeGuard();
      }
    });

    return {};
  }
});
</script>

<style>
.animated {
  animation-duration: 0.3s;
  animation-fill-mode: both;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

.fadeIn {
  animation-name: fadeIn;
}

.fadeOut {
  animation-name: fadeOut;
}
</style>