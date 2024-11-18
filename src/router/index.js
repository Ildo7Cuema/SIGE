import { route } from 'quasar/wrappers';
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from 'vue-router';
import routes from './routes';
import useSupabase from 'boot/supabase';
import { useQuasar } from 'quasar';

export default route(function () {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
    ? createWebHistory
    : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  Router.beforeEach(async (to, from, next) => {
    const { supabase } = useSupabase();
    const $q = useQuasar();

    if (to.meta.requiresAuth) {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        next('/login');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (!profile) {
        next('/login');
        return;
      }

      // Verificar pagamento da escola
      if (['professor', 'aluno', 'encarregado'].includes(profile.role)) {
        const { data: escola } = await supabase
          .from('escolas_usuarios')
          .select('escola_id')
          .eq('user_id', session.user.id)
          .single();

        if (escola) {
          const { data: pagamentos } = await supabase
            .from('pagamentos_escola')
            .select('*')
            .eq('escola_id', escola.escola_id)
            .order('data', { ascending: false })
            .limit(1);

          const ultimoPagamento = pagamentos?.[0];
          if (ultimoPagamento) {
            const hoje = new Date();
            const dataPagamento = new Date(ultimoPagamento.data);
            const diffMeses = (hoje.getMonth() - dataPagamento.getMonth()) + 
              (12 * (hoje.getFullYear() - dataPagamento.getFullYear()));

            if (diffMeses >= 1) {
              $q.dialog({
                title: 'Acesso Bloqueado',
                message: 'A escola está com o pagamento em atraso. Por favor, entre em contato com a administração.',
                persistent: true,
                ok: {
                  label: 'Entendi',
                  color: 'primary'
                }
              }).onOk(() => {
                next('/login');
              });
              return;
            }
          }
        }
      }

      // Verificar pagamento do aluno/encarregado
      if (['aluno', 'encarregado'].includes(profile.role)) {
        const hoje = new Date();
        const primeiroDiaMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);

        const { data: pagamentos } = await supabase
          .from('pagamentos')
          .select('*')
          .eq('tipo', 'Propina')
          .gte('data_pagamento', primeiroDiaMes.toISOString())
          .eq('aluno_id', profile.role === 'aluno' ? profile.id : profile.educando_id)
          .order('data_pagamento', { ascending: false })
          .limit(1);

        if (!pagamentos || pagamentos.length === 0) {
          $q.dialog({
            title: 'Acesso Bloqueado',
            message: 'A mensalidade está em atraso. Por favor, efetue o pagamento para continuar.',
            persistent: true,
            ok: {
              label: 'Ir para Pagamentos',
              color: 'primary'
            },
            cancel: {
              label: 'Sair',
              color: 'negative'
            }
          }).onOk(() => {
            next('/pagamentos');
          }).onCancel(() => {
            next('/login');
          });
          return;
        }
      }

      // Verificar se o usuário tem acesso à rota
      if (to.meta.role && to.meta.role !== profile.role) {
        next('/');
        return;
      }
    }

    next();
  });

  return Router;
});