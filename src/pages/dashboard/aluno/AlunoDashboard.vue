<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
      <!-- Estatísticas Rápidas -->
      <div class="col-12 col-md-3">
        <q-card class="dashboard-card">
          <q-card-section>
            <div class="text-h6">Média Geral</div>
            <div class="text-h4 text-primary">{{ stats.mediaGeral }}%</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-3">
        <q-card class="dashboard-card">
          <q-card-section>
            <div class="text-h6">Presenças</div>
            <div class="text-h4 text-secondary">{{ stats.presencas }}%</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-3">
        <q-card class="dashboard-card">
          <q-card-section>
            <div class="text-h6">Disciplinas</div>
            <div class="text-h4 text-accent">{{ stats.disciplinas }}</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-3">
        <q-card class="dashboard-card">
          <q-card-section>
            <div class="text-h6">Avaliações Pendentes</div>
            <div class="text-h4 text-negative">{{ stats.avaliacoesPendentes }}</div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Próximas Avaliações -->
      <div class="col-12 col-md-6">
        <q-card>
          <q-card-section>
            <div class="text-h6">Próximas Avaliações</div>
            <q-list separator>
              <q-item v-for="avaliacao in proximasAvaliacoes" :key="avaliacao.id">
                <q-item-section avatar>
                  <q-icon name="assignment" color="primary" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ avaliacao.disciplina }}</q-item-label>
                  <q-item-label caption>{{ avaliacao.data }} - {{ avaliacao.tipo }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-chip color="warning" text-color="white">
                    {{ avaliacao.diasRestantes }} dias
                  </q-chip>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>

      <!-- Horário de Hoje -->
      <div class="col-12 col-md-6">
        <q-card>
          <q-card-section>
            <div class="text-h6">Horário de Hoje</div>
            <q-list separator>
              <q-item v-for="aula in aulasHoje" :key="aula.id">
                <q-item-section avatar>
                  <q-icon name="schedule" color="secondary" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ aula.disciplina }}</q-item-label>
                  <q-item-label caption>{{ aula.horario }} - Sala {{ aula.sala }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-chip :color="aula.status === 'Concluída' ? 'positive' : 'primary'" text-color="white">
                    {{ aula.status }}
                  </q-chip>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>

      <!-- Gráfico de Desempenho -->
      <div class="col-12">
        <q-card>
          <q-card-section>
            <div class="text-h6">Desempenho por Disciplina</div>
            <Bar :data="chartData" :options="chartOptions" />
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import useSupabase from 'boot/supabase'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default defineComponent({
  name: 'AlunoDashboard',
  components: { Bar },

  setup () {
    const { supabase } = useSupabase()
    
    const stats = ref({
      mediaGeral: 0,
      presencas: 0,
      disciplinas: 0,
      avaliacoesPendentes: 0
    })

    const proximasAvaliacoes = ref([
      {
        id: 1,
        disciplina: 'Matemática',
        data: '20/12/2023',
        tipo: 'Teste',
        diasRestantes: 5
      },
      {
        id: 2,
        disciplina: 'Português',
        data: '22/12/2023',
        tipo: 'Trabalho',
        diasRestantes: 7
      }
    ])

    const aulasHoje = ref([
      {
        id: 1,
        disciplina: 'Matemática',
        horario: '08:00 - 09:30',
        sala: '201',
        status: 'Concluída'
      },
      {
        id: 2,
        disciplina: 'Português',
        horario: '09:45 - 11:15',
        sala: '305',
        status: 'Próxima'
      }
    ])

    const chartData = ref({
      labels: ['Português', 'Matemática', 'História', 'Geografia', 'Ciências'],
      datasets: [
        {
          label: 'Notas',
          data: [85, 78, 90, 82, 88],
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF'
          ]
        }
      ]
    })

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          max: 100
        }
      }
    }

    onMounted(async () => {
      try {
        const user = await supabase.auth.getUser()
        if (user.data?.user) {
          // Carregar dados do aluno
          const { data: alunoData } = await supabase
            .from('alunos')
            .select('*')
            .eq('id', user.data.user.id)
            .single()

          if (alunoData) {
            stats.value = {
              mediaGeral: alunoData.media_geral || 85,
              presencas: alunoData.presencas || 95,
              disciplinas: alunoData.total_disciplinas || 8,
              avaliacoesPendentes: alunoData.avaliacoes_pendentes || 2
            }
          }
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
      }
    })

    return {
      stats,
      proximasAvaliacoes,
      aulasHoje,
      chartData,
      chartOptions
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