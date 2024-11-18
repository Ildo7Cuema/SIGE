<template>
  <q-page padding>
    <div class="row q-col-gutter-lg">
      <!-- Hero Section -->
      <div class="col-12 text-center q-py-lg">
        <h1 class="text-h3 text-weight-bold text-primary">Sistema de Gestão Escolar</h1>
        <p class="text-h6 text-grey-7 q-mt-md">
          Transformando a gestão escolar em Angola com tecnologia e inovação
        </p>
      </div>

      <!-- Nossa História -->
      <div class="col-12 col-md-6">
        <q-card class="about-card">
          <q-card-section>
            <div class="text-h5 text-primary q-mb-md">Nossa História</div>
            <p class="text-body1">
              Fundada em 2023, nossa empresa nasceu da necessidade de modernizar
              a gestão escolar em Angola. Com uma equipe dedicada de profissionais
              em educação e tecnologia, desenvolvemos uma solução completa que
              atende às necessidades específicas das escolas angolanas.
            </p>
          </q-card-section>
        </q-card>
      </div>

      <!-- Nossa Missão -->
      <div class="col-12 col-md-6">
        <q-card class="about-card">
          <q-card-section>
            <div class="text-h5 text-primary q-mb-md">Nossa Missão</div>
            <p class="text-body1">
              Facilitar a gestão escolar através de tecnologia inovadora,
              permitindo que escolas, professores e encarregados de educação
              trabalhem em conjunto para proporcionar uma educação de qualidade
              aos estudantes angolanos.
            </p>
          </q-card-section>
        </q-card>
      </div>

      <!-- Nossos Valores -->
      <div class="col-12">
        <q-card class="about-card">
          <q-card-section>
            <div class="text-h5 text-primary q-mb-md">Nossos Valores</div>
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-4">
                <div class="text-h6 text-secondary">Inovação</div>
                <p>Buscamos constantemente novas formas de melhorar a gestão escolar.</p>
              </div>
              <div class="col-12 col-md-4">
                <div class="text-h6 text-secondary">Qualidade</div>
                <p>Comprometidos com a excelência em todos os aspectos do nosso serviço.</p>
              </div>
              <div class="col-12 col-md-4">
                <div class="text-h6 text-secondary">Integridade</div>
                <p>Transparência e honestidade em todas as nossas relações.</p>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Recursos do Sistema -->
      <div class="col-12">
        <q-card class="about-card">
          <q-card-section>
            <div class="text-h5 text-primary q-mb-md">Recursos do Sistema</div>
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-3" v-for="(recurso, index) in recursos" :key="index">
                <q-card class="resource-card">
                  <q-card-section>
                    <q-icon :name="recurso.icon" size="3em" color="primary" />
                    <div class="text-h6 q-mt-sm">{{ recurso.titulo }}</div>
                    <p class="text-grey-7">{{ recurso.descricao }}</p>
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Estatísticas -->
      <div class="col-12">
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-3" v-for="(stat, index) in estatisticas" :key="index">
            <q-card class="stat-card text-center">
              <q-card-section>
                <div class="text-h3 text-primary">{{ stat.valor }}</div>
                <div class="text-subtitle1">{{ stat.titulo }}</div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'SobrePage',

  setup () {
    const recursos = ref([
      {
        icon: 'school',
        titulo: 'Gestão Acadêmica',
        descricao: 'Controle completo de matrículas, notas e frequência'
      },
      {
        icon: 'people',
        titulo: 'Gestão de Usuários',
        descricao: 'Administração de alunos, professores e funcionários'
      },
      {
        icon: 'payments',
        titulo: 'Gestão Financeira',
        descricao: 'Controle de mensalidades e pagamentos'
      },
      {
        icon: 'analytics',
        titulo: 'Relatórios',
        descricao: 'Geração de relatórios e estatísticas detalhadas'
      }
    ])

    const estatisticas = ref([
      {
        valor: '50+',
        titulo: 'Escolas Parceiras'
      },
      {
        valor: '10k+',
        titulo: 'Alunos'
      },
      {
        valor: '1k+',
        titulo: 'Professores'
      },
      {
        valor: '95%',
        titulo: 'Satisfação'
      }
    ])

    return {
      recursos,
      estatisticas
    }
  }
})
</script>

<style lang="scss" scoped>
.about-card, .resource-card, .stat-card {
  transition: transform 0.3s;
  height: 100%;

  &:hover {
    transform: translateY(-5px);
  }
}

.resource-card {
  text-align: center;
  padding: 20px;
}

.stat-card {
  background: linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%);
}
</style>