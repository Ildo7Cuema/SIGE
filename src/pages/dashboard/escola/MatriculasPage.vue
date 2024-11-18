<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
      <!-- Lista de Matrículas Pendentes -->
      <div class="col-12">
        <q-card>
          <q-card-section>
            <div class="text-h6">Matrículas Pendentes</div>
            <q-table
              :rows="matriculasPendentes"
              :columns="columns"
              row-key="id"
              :loading="loading"
            >
              <template v-slot:top>
                <q-btn
                  color="primary"
                  label="Nova Matrícula"
                  @click="showNovaMatricula = true"
                  icon="add"
                />
              </template>

              <template v-slot:body-cell-actions="props">
                <q-td :props="props">
                  <q-btn-group flat>
                    <q-btn
                      flat
                      round
                      color="positive"
                      icon="check"
                      @click="confirmarMatricula(props.row)"
                    >
                      <q-tooltip>Confirmar Matrícula</q-tooltip>
                    </q-btn>
                    <q-btn
                      flat
                      round
                      color="negative"
                      icon="close"
                      @click="recusarMatricula(props.row)"
                    >
                      <q-tooltip>Recusar Matrícula</q-tooltip>
                    </q-btn>
                  </q-btn-group>
                </q-td>
              </template>
            </q-table>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Diálogo de Nova Matrícula -->
    <q-dialog v-model="showNovaMatricula" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Nova Matrícula</div>
        </q-card-section>

        <q-card-section>
          <q-form @submit="salvarMatricula" class="q-gutter-md">
            <q-input
              v-model="novaMatricula.nome"
              label="Nome do Aluno"
              :rules="[val => !!val || 'Nome é obrigatório']"
            />

            <q-select
              v-model="novaMatricula.curso"
              :options="cursos"
              label="Curso"
              :rules="[val => !!val || 'Curso é obrigatório']"
            />

            <q-select
              v-model="novaMatricula.classe"
              :options="classes"
              label="Classe"
              :rules="[val => !!val || 'Classe é obrigatória']"
            />

            <q-select
              v-model="novaMatricula.turma"
              :options="turmas"
              label="Turma"
              :rules="[val => !!val || 'Turma é obrigatória']"
            />

            <q-select
              v-model="novaMatricula.periodo"
              :options="periodos"
              label="Período"
              :rules="[val => !!val || 'Período é obrigatório']"
            />

            <div class="row justify-end q-gutter-sm">
              <q-btn label="Cancelar" color="negative" v-close-popup />
              <q-btn label="Salvar" type="submit" color="primary" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import useSupabase from 'boot/supabase'

export default defineComponent({
  name: 'MatriculasPage',

  setup () {
    const $q = useQuasar()
    const { supabase } = useSupabase()
    const loading = ref(false)
    const showNovaMatricula = ref(false)

    const columns = [
      { name: 'nome', label: 'Nome', field: 'nome', align: 'left' },
      { name: 'curso', label: 'Curso', field: 'curso', align: 'left' },
      { name: 'classe', label: 'Classe', field: 'classe', align: 'left' },
      { name: 'turma', label: 'Turma', field: 'turma', align: 'left' },
      { name: 'periodo', label: 'Período', field: 'periodo', align: 'left' },
      { name: 'status', label: 'Status', field: 'status', align: 'left' },
      { name: 'actions', label: 'Ações', field: 'actions', align: 'center' }
    ]

    const matriculasPendentes = ref([])
    const novaMatricula = ref({
      nome: '',
      curso: null,
      classe: null,
      turma: null,
      periodo: null
    })

    const cursos = ref([])
    const classes = ref([])
    const turmas = ref([])
    const periodos = ref(['Manhã', 'Tarde', 'Noite'])

    const carregarMatriculas = async () => {
      loading.value = true
      try {
        const { data, error } = await supabase
          .from('matriculas')
          .select('*')
          .eq('status', 'pendente')
          .eq('escola_id', await getEscolaId())

        if (error) throw error
        matriculasPendentes.value = data
      } catch (error) {
        console.error('Erro ao carregar matrículas:', error)
        $q.notify({
          type: 'negative',
          message: 'Erro ao carregar matrículas'
        })
      } finally {
        loading.value = false
      }
    }

    const getEscolaId = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      const { data } = await supabase
        .from('escolas')
        .select('id')
        .eq('user_id', user.id)
        .single()
      return data?.id
    }

    const confirmarMatricula = async (matricula) => {
      try {
        const { error } = await supabase
          .from('matriculas')
          .update({ status: 'confirmada' })
          .eq('id', matricula.id)

        if (error) throw error

        $q.notify({
          type: 'positive',
          message: 'Matrícula confirmada com sucesso!'
        })

        carregarMatriculas()
      } catch (error) {
        console.error('Erro ao confirmar matrícula:', error)
        $q.notify({
          type: 'negative',
          message: 'Erro ao confirmar matrícula'
        })
      }
    }

    const recusarMatricula = async (matricula) => {
      try {
        const { error } = await supabase
          .from('matriculas')
          .update({ status: 'recusada' })
          .eq('id', matricula.id)

        if (error) throw error

        $q.notify({
          type: 'positive',
          message: 'Matrícula recusada'
        })

        carregarMatriculas()
      } catch (error) {
        console.error('Erro ao recusar matrícula:', error)
        $q.notify({
          type: 'negative',
          message: 'Erro ao recusar matrícula'
        })
      }
    }

    const salvarMatricula = async () => {
      try {
        const { error } = await supabase
          .from('matriculas')
          .insert({
            ...novaMatricula.value,
            escola_id: await getEscolaId(),
            status: 'pendente'
          })

        if (error) throw error

        $q.notify({
          type: 'positive',
          message: 'Matrícula registrada com sucesso!'
        })

        showNovaMatricula.value = false
        carregarMatriculas()
      } catch (error) {
        console.error('Erro ao salvar matrícula:', error)
        $q.notify({
          type: 'negative',
          message: 'Erro ao salvar matrícula'
        })
      }
    }

    onMounted(async () => {
      await carregarMatriculas()
      // Carregar dados de configuração
      const { data: cursosData } = await supabase.from('cursos').select('*')
      const { data: classesData } = await supabase.from('classes').select('*')
      const { data: turmasData } = await supabase.from('turmas').select('*')

      cursos.value = cursosData || []
      classes.value = classesData || []
      turmas.value = turmasData || []
    })

    return {
      loading,
      columns,
      matriculasPendentes,
      showNovaMatricula,
      novaMatricula,
      cursos,
      classes,
      turmas,
      periodos,
      confirmarMatricula,
      recusarMatricula,
      salvarMatricula
    }
  }
})
</script>