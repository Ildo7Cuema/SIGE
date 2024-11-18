<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
      <!-- Filtros -->
      <div class="col-12">
        <q-card>
          <q-card-section>
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-4">
                <q-select
                  v-model="turmaSelected"
                  :options="turmas"
                  label="Turma"
                  option-label="nome"
                  emit-value
                  map-options
                  @update:model-value="carregarAlunos"
                />
              </div>
              <div class="col-12 col-md-4">
                <q-select
                  v-model="periodoSelected"
                  :options="periodos"
                  label="Período"
                />
              </div>
              <div class="col-12 col-md-4">
                <q-btn
                  color="primary"
                  icon="print"
                  label="Imprimir Lista"
                  @click="imprimirLista"
                  class="full-width"
                />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Lista de Alunos -->
      <div class="col-12">
        <q-card>
          <q-card-section>
            <div class="text-h6">Alunos Matriculados</div>
            <q-table
              :rows="alunos"
              :columns="columns"
              row-key="id"
              :loading="loading"
            >
              <template v-slot:body="props">
                <q-tr :props="props">
                  <q-td key="numero" :props="props">
                    {{ props.rowIndex + 1 }}
                  </q-td>
                  <q-td key="nome" :props="props">
                    {{ props.row.nome }}
                  </q-td>
                  <q-td key="genero" :props="props">
                    {{ props.row.genero }}
                  </q-td>
                  <q-td key="idade" :props="props">
                    {{ calcularIdade(props.row.data_nascimento) }}
                  </q-td>
                  <q-td key="actions" :props="props">
                    <q-btn
                      flat
                      round
                      color="primary"
                      icon="visibility"
                      @click="verDetalhes(props.row)"
                    >
                      <q-tooltip>Ver Detalhes</q-tooltip>
                    </q-btn>
                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Diálogo de Detalhes -->
    <q-dialog v-model="showDetalhes" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Detalhes do Aluno</div>
        </q-card-section>

        <q-card-section v-if="alunoSelecionado">
          <q-list>
            <q-item>
              <q-item-section>
                <q-item-label>Nome Completo</q-item-label>
                <q-item-label caption>{{ alunoSelecionado.nome }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section>
                <q-item-label>Data de Nascimento</q-item-label>
                <q-item-label caption>
                  {{ formatarData(alunoSelecionado.data_nascimento) }}
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section>
                <q-item-label>Género</q-item-label>
                <q-item-label caption>{{ alunoSelecionado.genero }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section>
                <q-item-label>Endereço</q-item-label>
                <q-item-label caption>{{ alunoSelecionado.endereco }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section>
                <q-item-label>Contacto</q-item-label>
                <q-item-label caption>{{ alunoSelecionado.contacto }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Fechar" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import useSupabase from 'boot/supabase'
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'
import moment from 'moment'

export default defineComponent({
  name: 'ListaAlunosPage',

  setup() {
    const $q = useQuasar()
    const { supabase } = useSupabase()
    const loading = ref(false)
    const turmas = ref([])
    const alunos = ref([])
    const turmaSelected = ref(null)
    const periodoSelected = ref('Manhã')
    const periodos = ['Manhã', 'Tarde', 'Noite']
    const showDetalhes = ref(false)
    const alunoSelecionado = ref(null)

    const columns = [
      { name: 'numero', label: 'Nº', field: 'numero', align: 'center' },
      { name: 'nome', label: 'Nome', field: 'nome', align: 'left' },
      { name: 'genero', label: 'Género', field: 'genero', align: 'center' },
      { name: 'idade', label: 'Idade', field: 'idade', align: 'center' },
      { name: 'actions', label: 'Ações', field: 'actions', align: 'center' }
    ]

    const calcularIdade = (dataNascimento) => {
      return moment().diff(moment(dataNascimento), 'years')
    }

    const formatarData = (data) => {
      return moment(data).format('DD/MM/YYYY')
    }

    const carregarTurmas = async () => {
      try {
        const { data, error } = await supabase
          .from('turmas')
          .select('*')
        if (error) throw error
        turmas.value = data
      } catch (error) {
        console.error('Erro ao carregar turmas:', error)
      }
    }

    const carregarAlunos = async () => {
      if (!turmaSelected.value) return
      loading.value = true
      try {
        const { data, error } = await supabase
          .from('alunos')
          .select('*')
          .eq('turma_id', turmaSelected.value.id)
          .eq('periodo', periodoSelected.value)
        if (error) throw error
        alunos.value = data
      } catch (error) {
        console.error('Erro ao carregar alunos:', error)
      } finally {
        loading.value = false
      }
    }

    const verDetalhes = (aluno) => {
      alunoSelecionado.value = aluno
      showDetalhes.value = true
    }

    const imprimirLista = () => {
      const doc = new jsPDF()
      const turma = turmaSelected.value?.nome

      // Cabeçalho
      doc.setFontSize(16)
      doc.text('Lista de Alunos Matriculados', 105, 15, { align: 'center' })
      
      doc.setFontSize(12)
      doc.text(`Turma: ${turma}`, 14, 25)
      doc.text(`Período: ${periodoSelected.value}`, 14, 32)
      doc.text(`Data: ${moment().format('DD/MM/YYYY')}`, 14, 39)

      // Preparar dados para a tabela
      const tableData = alunos.value.map((aluno, index) => [
        index + 1,
        aluno.nome,
        aluno.genero,
        calcularIdade(aluno.data_nascimento)
      ])

      // Gerar tabela
      doc.autoTable({
        startY: 45,
        head: [['Nº', 'Nome', 'Género', 'Idade']],
        body: tableData,
        theme: 'grid',
        styles: {
          fontSize: 10,
          cellPadding: 2
        },
        columnStyles: {
          0: { cellWidth: 15 },
          1: { cellWidth: 'auto' },
          2: { cellWidth: 25 },
          3: { cellWidth: 20 }
        }
      })

      // Adicionar rodapé
      const finalY = doc.lastAutoTable.finalY + 20
      doc.line(20, finalY, 80, finalY)
      doc.line(120, finalY, 180, finalY)
      doc.text('Diretor(a) de Turma', 30, finalY + 5)
      doc.text('Diretor(a)', 140, finalY + 5)

      doc.save(`lista-alunos-${turma}.pdf`)
    }

    onMounted(() => {
      carregarTurmas()
    })

    return {
      loading,
      turmas,
      alunos,
      columns,
      turmaSelected,
      periodoSelected,
      periodos,
      showDetalhes,
      alunoSelecionado,
      calcularIdade,
      formatarData,
      carregarAlunos,
      verDetalhes,
      imprimirLista
    }
  }
})
</script>