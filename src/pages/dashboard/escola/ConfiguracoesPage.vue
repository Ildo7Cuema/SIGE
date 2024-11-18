<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
      <!-- Cursos -->
      <div class="col-12 col-md-6">
        <q-card>
          <q-card-section>
            <div class="text-h6">Cursos</div>
            <q-list separator>
              <q-item v-for="curso in cursos" :key="curso.id">
                <q-item-section>
                  <q-item-label>{{ curso.nome }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-btn flat round color="negative" icon="delete" @click="removerCurso(curso.id)" />
                </q-item-section>
              </q-item>
            </q-list>
            <q-btn
              color="primary"
              label="Adicionar Curso"
              class="q-mt-sm"
              @click="showAddCurso = true"
            />
          </q-card-section>
        </q-card>
      </div>

      <!-- Disciplinas -->
      <div class="col-12 col-md-6">
        <q-card>
          <q-card-section>
            <div class="text-h6">Disciplinas</div>
            <q-list separator>
              <q-item v-for="disciplina in disciplinas" :key="disciplina.id">
                <q-item-section>
                  <q-item-label>{{ disciplina.nome }}</q-item-label>
                  <q-item-label caption>{{ disciplina.curso }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-btn flat round color="negative" icon="delete" @click="removerDisciplina(disciplina.id)" />
                </q-item-section>
              </q-item>
            </q-list>
            <q-btn
              color="primary"
              label="Adicionar Disciplina"
              class="q-mt-sm"
              @click="showAddDisciplina = true"
            />
          </q-card-section>
        </q-card>
      </div>

      <!-- Classes -->
      <div class="col-12 col-md-6">
        <q-card>
          <q-card-section>
            <div class="text-h6">Classes</div>
            <q-list separator>
              <q-item v-for="classe in classes" :key="classe.id">
                <q-item-section>
                  <q-item-label>{{ classe.nome }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-btn flat round color="negative" icon="delete" @click="removerClasse(classe.id)" />
                </q-item-section>
              </q-item>
            </q-list>
            <q-btn
              color="primary"
              label="Adicionar Classe"
              class="q-mt-sm"
              @click="showAddClasse = true"
            />
          </q-card-section>
        </q-card>
      </div>

      <!-- Turmas -->
      <div class="col-12 col-md-6">
        <q-card>
          <q-card-section>
            <div class="text-h6">Turmas</div>
            <q-list separator>
              <q-item v-for="turma in turmas" :key="turma.id">
                <q-item-section>
                  <q-item-label>{{ turma.nome }}</q-item-label>
                  <q-item-label caption>
                    {{ turma.classe }} - {{ turma.periodo }}
                  </q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-btn flat round color="negative" icon="delete" @click="removerTurma(turma.id)" />
                </q-item-section>
              </q-item>
            </q-list>
            <q-btn
              color="primary"
              label="Adicionar Turma"
              class="q-mt-sm"
              @click="showAddTurma = true"
            />
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Diálogos de Adição -->
    <q-dialog v-model="showAddCurso">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Novo Curso</div>
        </q-card-section>

        <q-card-section>
          <q-input v-model="novoCurso.nome" label="Nome do Curso" />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="negative" v-close-popup />
          <q-btn flat label="Salvar" color="primary" @click="salvarCurso" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showAddDisciplina">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Nova Disciplina</div>
        </q-card-section>

        <q-card-section>
          <q-input v-model="novaDisciplina.nome" label="Nome da Disciplina" class="q-mb-md" />
          <q-select v-model="novaDisciplina.curso" :options="cursos" label="Curso" option-label="nome" />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="negative" v-close-popup />
          <q-btn flat label="Salvar" color="primary" @click="salvarDisciplina" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showAddClasse">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Nova Classe</div>
        </q-card-section>

        <q-card-section>
          <q-input v-model="novaClasse.nome" label="Nome da Classe" />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="negative" v-close-popup />
          <q-btn flat label="Salvar" color="primary" @click="salvarClasse" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showAddTurma">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Nova Turma</div>
        </q-card-section>

        <q-card-section>
          <q-input v-model="novaTurma.nome" label="Nome da Turma" class="q-mb-md" />
          <q-select v-model="novaTurma.classe" :options="classes" label="Classe" option-label="nome" class="q-mb-md" />
          <q-select v-model="novaTurma.periodo" :options="periodos" label="Período" />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="negative" v-close-popup />
          <q-btn flat label="Salvar" color="primary" @click="salvarTurma" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import useSupabase from 'boot/supabase'

export default defineComponent({
  name: 'ConfiguracoesPage',

  setup () {
    const $q = useQuasar()
    const { supabase } = useSupabase()

    // Dados
    const cursos = ref([])
    const disciplinas = ref([])
    const classes = ref([])
    const turmas = ref([])
    const periodos = ['Manhã', 'Tarde', 'Noite']

    // Estados dos diálogos
    const showAddCurso = ref(false)
    const showAddDisciplina = ref(false)
    const showAddClasse = ref(false)
    const showAddTurma = ref(false)

    // Novos itens
    const novoCurso = ref({ nome: '' })
    const novaDisciplina = ref({ nome: '', curso: null })
    const novaClasse = ref({ nome: '' })
    const novaTurma = ref({ nome: '', classe: null, periodo: null })

    const getEscolaId = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      const { data } = await supabase
        .from('escolas')
        .select('id')
        .eq('user_id', user.id)
        .single()
      return data?.id
    }

    // Funções de carregamento
    const carregarDados = async () => {
      const escolaId = await getEscolaId()
      const [cursosData, disciplinasData, classesData, turmasData] = await Promise.all([
        supabase.from('cursos').select('*').eq('escola_id', escolaId),
        supabase.from('disciplinas').select('*').eq('escola_id', escolaId),
        supabase.from('classes').select('*').eq('escola_id', escolaId),
        supabase.from('turmas').select('*').eq('escola_id', escolaId)
      ])

      cursos.value = cursosData.data || []
      disciplinas.value = disciplinasData.data || []
      classes.value = classesData.data || []
      turmas.value = turmasData.data || []
    }

    // Funções de salvamento
    const salvarCurso = async () => {
      try {
        const { error } = await supabase
          .from('cursos')
          .insert({
            nome: novoCurso.value.nome,
            escola_id: await getEscolaId()
          })

        if (error) throw error

        $q.notify({
          type: 'positive',
          message: 'Curso adicionado com sucesso!'
        })

        showAddCurso.value = false
        novoCurso.value = { nome: '' }
        await carregarDados()
      } catch (error) {
        console.error('Erro ao salvar curso:', error)
        $q.notify({
          type: 'negative',
          message: 'Erro ao adicionar curso'
        })
      }
    }

    const salvarDisciplina = async () => {
      try {
        const { error } = await supabase
          .from('disciplinas')
          .insert({
            nome: novaDisciplina.value.nome,
            curso_id: novaDisciplina.value.curso.id,
            escola_id: await getEscolaId()
          })

        if (error) throw error

        $q.notify({
          type: 'positive',
          message: 'Disciplina adicionada com sucesso!'
        })

        showAddDisciplina.value = false
        novaDisciplina.value = { nome: '', curso: null }
        await carregarDados()
      } catch (error) {
        console.error('Erro ao salvar disciplina:', error)
        $q.notify({
          type: 'negative',
          message: 'Erro ao adicionar disciplina'
        })
      }
    }

    const salvarClasse = async () => {
      try {
        const { error } = await supabase
          .from('classes')
          .insert({
            nome: novaClasse.value.nome,
            escola_id: await getEscolaId()
          })

        if (error) throw error

        $q.notify({
          type: 'positive',
          message: 'Classe adicionada com sucesso!'
        })

        showAddClasse.value = false
        novaClasse.value = { nome: '' }
        await carregarDados()
      } catch (error) {
        console.error('Erro ao salvar classe:', error)
        $q.notify({
          type: 'negative',
          message: 'Erro ao adicionar classe'
        })
      }
    }

    const salvarTurma = async () => {
      try {
        const { error } = await supabase
          .from('turmas')
          .insert({
            nome: novaTurma.value.nome,
            classe_id: novaTurma.value.classe.id,
            periodo: novaTurma.value.periodo,
            escola_id: await getEscolaId()
          })

        if (error) throw error

        $q.notify({
          type: 'positive',
          message: 'Turma adicionada com sucesso!'
        })

        showAddTurma.value = false
        novaTurma.value = { nome: '', classe: null, periodo: null }
        await carregarDados()
      } catch (error) {
        console.error('Erro ao salvar turma:', error)
        $q.notify({
          type: 'negative',
          message: 'Erro ao adicionar turma'
        })
      }
    }

    // Funções de remoção
    const removerCurso = async (id) => {
      try {
        const { error } = await supabase
          .from('cursos')
          .delete()
          .eq('id', id)

        if (error) throw error

        $q.notify({
          type: 'positive',
          message: 'Curso removido com sucesso!'
        })

        await carregarDados()
      } catch (error) {
        console.error('Erro ao remover curso:', error)
        $q.notify({
          type: 'negative',
          message: 'Erro ao remover curso'
        })
      }
    }

    const removerDisciplina = async (id) => {
      try {
        const { error } = await supabase
          .from('disciplinas')
          .delete()
          .eq('id', id)

        if (error) throw error

        $q.notify({
          type: 'positive',
          message: 'Disciplina removida com sucesso!'
        })

        await carregarDados()
      } catch (error) {
        console.error('Erro ao remover disciplina:', error)
        $q.notify({
          type: 'negative',
          message: 'Erro ao remover disciplina'
        })
      }
    }

    const removerClasse = async (id) => {
      try {
        const { error } = await supabase
          .from('classes')
          .delete()
          .eq('id', id)

        if (error) throw error

        $q.notify({
          type: 'positive',
          message: 'Classe removida com sucesso!'
        })

        await carregarDados()
      } catch (error) {
        console.error('Erro ao remover classe:', error)
        $q.notify({
          type: 'negative',
          message: 'Erro ao remover classe'
        })
      }
    }

    const removerTurma = async (id) => {
      try {
        const { error } = await supabase
          .from('turmas')
          .delete()
          .eq('id', id)

        if (error) throw error

        $q.notify({
          type: 'positive',
          message: 'Turma removida com sucesso!'
        })

        await carregarDados()
      } catch (error) {
        console.error('Erro ao remover turma:', error)
        $q.notify({
          type: 'negative',
          message: 'Erro ao remover turma'
        })
      }
    }

    onMounted(carregarDados)

    return {
      cursos,
      disciplinas,
      classes,
      turmas,
      periodos,
      showAddCurso,
      showAddDisciplina,
      showAddClasse,
      showAddTurma,
      novoCurso,
      novaDisciplina,
      novaClasse,
      novaTurma,
      salvarCurso,
      salvarDisciplina,
      salvarClasse,
      salvarTurma,
      removerCurso,
      removerDisciplina,
      removerClasse,
      removerTurma
    }
  }
})
</script>