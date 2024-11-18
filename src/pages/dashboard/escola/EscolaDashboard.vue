<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
      <!-- Estatísticas Gerais -->
      <div class="col-12 col-md-3">
        <q-card class="dashboard-card">
          <q-card-section>
            <div class="text-h6">Total de Alunos</div>
            <div class="text-h4 text-primary">{{ stats.totalAlunos }}</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-3">
        <q-card class="dashboard-card">
          <q-card-section>
            <div class="text-h6">Total de Professores</div>
            <div class="text-h4 text-secondary">{{ stats.totalProfessores }}</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-3">
        <q-card class="dashboard-card">
          <q-card-section>
            <div class="text-h6">Total de Turmas</div>
            <div class="text-h4 text-accent">{{ stats.totalTurmas }}</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-3">
        <q-card class="dashboard-card">
          <q-card-section>
            <div class="text-h6">Média Geral</div>
            <div class="text-h4 text-positive">{{ stats.mediaGeral }}%</div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Gráficos -->
      <div class="col-12 col-md-6">
        <q-card>
          <q-card-section>
            <div class="text-h6">Desempenho por Disciplina</div>
            <Bar :data="chartData.desempenho" :options="chartOptions" />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-6">
        <q-card>
          <q-card-section>
            <div class="text-h6">Distribuição de Alunos por Ano</div>
            <Doughnut :data="chartData.distribuicao" :options="chartOptions" />
          </q-card-section>
        </q-card>
      </div>

      <!-- Últimas Atividades -->
      <div class="col-12">
        <q-card>
          <q-card-section>
            <div class="text-h6">Últimas Atividades</div>
            <q-list separator>
              <q-item v-for="atividade in atividades" :key="atividade.id">
                <q-item-section avatar>
                  <q-icon :name="atividade.icon" :color="atividade.color" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ atividade.descricao }}</q-item-label>
                  <q-item-label caption>{{ atividade.data }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import { Bar, Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js'
import useSupabase from 'boot/supabase'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement)

export default defineComponent({
  name: 'EscolaDashboard',
  components: { Bar, Doughnut },

  setup () {
    const { supabase } = useSupabase()
    const stats = ref({
      totalAlunos: 0,
      totalProfessores: 0,
      totalTurmas: 0,
      mediaGeral: 0
    })

    const chartData = ref({
      desempenho: {
        labels: ['Português', 'Matemática', 'História', 'Geografia', 'Ciências'],
        datasets: [{
          label: 'Média por Disciplina',
          data: [75, 68, 82, 78, 85],
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
        }]
      },
      distribuicao: {
        labels: ['1º Ano', '2º Ano', '3º Ano', '4º Ano', '5º Ano'],
        datasets: [{
          data: [30, 25, 22, 20, 18],
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
        }]
      }
    })

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false
    }

    const atividades = ref([
      {
        id: 1,
        icon: 'person_add',
        color: 'primary',
        descricao: 'Novo aluno matriculado',
        data: '2023-12-15'
      },
      {
        id: 2,
        icon: 'grade',
        color: 'secondary',
        descricao: 'Notas do 1º período lançadas',
        data: '2023-12-14'
      },
      {
        id: 3,
        icon: 'event',
        color: 'accent',
        descricao: 'Reunião de professores agendada',
        data: '2023-12-13'
      }
    ])

    onMounted(async () => {
      // Carregar dados do Supabase
      try {
        const [alunos, professores, turmas] = await Promise.all([
          supabase.from('profiles').count().eq('role', 'aluno'),
          supabase.from('profiles').count().eq('role', 'professor'),
          supabase.from('turmas').count()
        ])

        stats.value = {
          totalAlunos: alunos.count || 0,
          totalProfessores: professores.count || 0,
          totalTurmas: turmas.count || 0,
          mediaGeral: 78 // Exemplo estático
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
      }
    })

    return {
      stats,
      chartData,
      chartOptions,
      atividades
    }
  }
})
</script>

<style lang="scss" scoped>
.dashboard-card {
  transition: transform 0.2s;
  &:hover {
    transform: translateY(-5px);
  }
}
</style>