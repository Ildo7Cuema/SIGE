<template>
  <q-page class="q-pa-none">
    <!-- Hero Section with Carousel -->
    <div class="hero-section">
      <q-carousel
        v-model="slide"
        transition-prev="slide-right"
        transition-next="slide-left"
        swipeable
        animated
        control-color="white"
        navigation
        padding
        arrows
        height="60vh"
        class="bg-primary text-white shadow-1"
        @mouseenter="autoplay = false"
        @mouseleave="autoplay = true"
      >
        <q-carousel-slide v-for="(slide, index) in slides" :key="index" :name="index" :img-src="slide.image">
          <div class="absolute-bottom custom-caption q-pa-md text-center">
            <div class="text-h3 text-weight-bold">{{ slide.title }}</div>
            <div class="text-h5 q-mt-sm">{{ slide.subtitle }}</div>
            <q-btn
              :color="slide.btnColor"
              :text-color="slide.btnTextColor"
              :label="slide.btnText"
              :icon-right="slide.btnIcon"
              to="/registar"
              size="lg"
              unelevated
              class="q-mt-md q-px-xl"
            />
          </div>
        </q-carousel-slide>
      </q-carousel>
    </div>

    <!-- Features Section -->
    <div class="q-pa-md q-mt-md">
      <div class="row q-col-gutter-lg">
        <div class="col-12 col-md-4" v-for="(feature, index) in features" :key="index">
          <q-card flat bordered class="feature-card">
            <q-card-section class="text-center">
              <q-icon :name="feature.icon" color="primary" size="4em" />
              <div class="text-h6 q-mt-sm">{{ feature.title }}</div>
              <p class="text-grey-7">{{ feature.description }}</p>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>

    <!-- Stats Section -->
    <div class="bg-grey-2 q-pa-xl q-mt-md">
      <div class="row q-col-gutter-lg">
        <div class="col-6 col-md-3" v-for="(stat, index) in stats" :key="index">
          <q-card flat class="text-center stat-card">
            <q-card-section>
              <div class="text-h3 text-primary">{{ stat.value }}</div>
              <div class="text-subtitle1 text-grey-8">{{ stat.label }}</div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>

    <!-- CTA Section -->
    <div class="cta-section text-center q-pa-xl">
      <h2 class="text-h4 text-weight-bold q-mb-md">Pronto para transformar sua escola?</h2>
      <p class="text-h6 q-mb-lg">Junte-se a milhares de escolas que já estão modernizando sua gestão</p>
      <div class="row justify-center q-gutter-md">
        <q-btn
          color="primary"
          label="Criar Conta"
          to="/registar"
          unelevated
          size="lg"
          icon-right="school"
        />
        <q-btn
          outline
          color="primary"
          label="Saber Mais"
          to="/sobre"
          size="lg"
          icon-right="info"
        />
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted, onBeforeUnmount } from 'vue'

export default defineComponent({
  name: 'HomePage',

  setup () {
    const slide = ref(0)
    const autoplay = ref(true)
    let timer

    const slides = [
      {
        image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7',
        title: 'Gestão Escolar Moderna',
        subtitle: 'Transforme sua escola com tecnologia de ponta',
        btnText: 'Começar Agora',
        btnIcon: 'rocket_launch',
        btnColor: 'white',
        btnTextColor: 'primary'
      },
      {
        image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655',
        title: 'Educação de Qualidade',
        subtitle: 'Ferramentas completas para professores e alunos',
        btnText: 'Descobrir Mais',
        btnIcon: 'school',
        btnColor: 'white',
        btnTextColor: 'primary'
      },
      {
        image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45',
        title: 'Gestão Simplificada',
        subtitle: 'Tudo que sua escola precisa em um só lugar',
        btnText: 'Experimentar',
        btnIcon: 'auto_awesome',
        btnColor: 'white',
        btnTextColor: 'primary'
      }
    ]

    const features = [
      {
        icon: 'school',
        title: 'Gestão Acadêmica',
        description: 'Controle completo de matrículas, notas e frequência'
      },
      {
        icon: 'groups',
        title: 'Gestão de Usuários',
        description: 'Administração eficiente de alunos e professores'
      },
      {
        icon: 'payments',
        title: 'Gestão Financeira',
        description: 'Controle simplificado de mensalidades e pagamentos'
      }
    ]

    const stats = [
      { value: '50+', label: 'Escolas Parceiras' },
      { value: '10k+', label: 'Alunos Ativos' },
      { value: '1k+', label: 'Professores' },
      { value: '95%', label: 'Satisfação' }
    ]

    const startAutoplay = () => {
      timer = setInterval(() => {
        if (autoplay.value) {
          slide.value = (slide.value + 1) % slides.length
        }
      }, 5000)
    }

    onMounted(() => {
      startAutoplay()
    })

    onBeforeUnmount(() => {
      clearInterval(timer)
    })

    return {
      slide,
      autoplay,
      slides,
      features,
      stats
    }
  }
})
</script>

<style lang="scss" scoped>
.hero-section {
  .custom-caption {
    background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%);
    padding: 50px 20px;
  }
}

.feature-card {
  transition: transform 0.2s;
  height: 100%;
  padding: 20px;

  &:hover {
    transform: translateY(-5px);
  }
}

.stat-card {
  background: transparent;
  
  .text-h3 {
    font-size: 2.5rem;
    font-weight: 700;
  }
}

.cta-section {
  background: linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%);
}

.q-carousel {
  &__slide {
    background-size: cover;
    background-position: center;
  }
}

.q-btn {
  border-radius: 8px;
  height: 44px;

  &--size-lg {
    height: 52px;
    font-size: 1.1rem;
  }
}
</style>