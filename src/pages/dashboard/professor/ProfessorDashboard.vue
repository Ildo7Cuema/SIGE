<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
      <!-- Estatísticas Rápidas -->
      <div class="col-12 col-md-3">
        <q-card class="dashboard-card">
          <q-card-section>
            <div class="text-h6">Total de Turmas</div>
            <div class="text-h4 text-primary">{{ stats.totalTurmas }}</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-3">
        <q-card class="dashboard-card">
          <q-card-section>
            <div class="text-h6">Total de Alunos</div>
            <div class="text-h4 text-secondary">{{ stats.totalAlunos }}</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-3">
        <q-card class="dashboard-card">
          <q-card-section>
            <div class="text-h6">Média das Turmas</div>
            <div class="text-h4 text-accent">{{ stats.mediaTurmas }}%</div>
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

      <!-- Próximas Aulas -->
      <div class="col-12 col-md-6">
        <q-card>
          <q-card-section>
            <div class="text-h6">Próximas Aulas</div>
            <q-list separator>
              <q-item v-for="aula in proximasAulas" :key="aula.id">
                <q-item-section avatar>
                  <q-icon name="schedule" color="primary" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ aula.turma }} - {{ aula.disciplina }}</q-item-label>
                  <q-item-label caption>{{ aula.horario }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-btn flat round color="primary" icon="edit" @click="editarAula(aula.id)" />
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>

      <!-- Últimas Avaliações -->
      <div class="col-12 col-md-6">
        <q-card>
          <q-card-section>
            <div class="text-h6">Últimas Avaliações</div>
            <q-list separator>
              <q-item v-for="avaliacao in ultimasAvaliacoes" :key="avaliacao.id">
                <q-item-section avatar>
                  <q-icon name="assignment" color="secondary" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ avaliacao.titulo }}</q-item-label>
                  <q-item-label caption>{{ avaliacao.turma }} - {{ avaliacao.data }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-chip :color="avaliacao.status === 'Corrigido' ? 'positive' : 'warning'" text-color="white">
                    {{ avaliacao.status }}
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
            <div class="text-h6">Desempenho por Turma</div>
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
import { useQuasar } from 'quasar'
import useSupabase from 'boot/supabase'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default defineComponent({
  name: 'ProfessorDashboard',
  components: { Bar },

  setup () {
    const $q = useQuasar()
    const { supabase } = useSupabase()
    
    const stats = ref({
      totalTurmas: 0,
      totalAlunos: 0,
      mediaTurmas: 0,
      avaliacoesPendentes: 0
    })

    const proximasAulas = ref([
      {
        id: 1,
        turma: '10º A',
        disciplina: 'Matemática',
        horario: 'Segunda-feira, 08:00'
      },
      {
        id: 2,
        turma: '11º B',
        disciplina: 'Matemática',
        horario: 'Segunda-feira, 10:00'
      },
      {
        id: 3,
        turma: '12º A',
        disciplina: 'Matemática',
        horario: 'Segunda-feira, 14:00'
      }
    ])

    const ultimasAvaliacoes = ref([
      {
        id: 1,
        titulo: 'Teste de Álgebra',
        turma: '10º A',
        data: '15/12/2023',
        status: 'Corrigido'
      },
      {
        id: 2,
        titulo: 'Trabalho de Geometria',
        turma: '11º B',
        data: '14/12/2023',
        status: 'Pendente'
      },
      {
        id: 3,
        titulo: 'Teste de Trigonometria',
        turma: '12º A',
        data: '13/12/2023',
        status: 'Corrigido'
      }
    ])

    const chartData = ref({
      labels: ['10º A', '10º B', '11º A', '11º B', '12º A'],
      datasets: [
        {
          label: 'Média da Turma',
          data: [75, 68, 82, 78, 85],
          backgroundColor: '#00b4ff'
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

    const editarAula = (id) => {
      $q.notify({
        type: 'info',
        message: 'Funcionalidade em desenvolvimento'
      })
    }

    onMounted(async () => {
      try {
        // Carregar dados do professor atual
        const user = await supabase.auth.getUser()
        if (user.data?.user) {
          const { data: professorData } = await supabase
            .from('professor_turmas')
            .select('*')
            .eq('professor_id', user.data.user.id)

          stats.value = {
            totalTurmas: professorData?.length || 0,
            totalAlunos: 120, // Exemplo estático
            mediaTurmas: 78,
            avaliacoesPendentes: 5
          }
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
        $q.notify({
          type: 'negative',
          message: 'Erro ao carregar dados do dashboard'
        })
      }
    })

    return {
      stats,
      proximasAulas,
      ultimasAvaliacoes,
      chartData,
      chartOptions,
      editarAula
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