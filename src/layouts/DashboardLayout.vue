<template>
  <q-layout view="hHh LpR fFf">
    <q-header elevated class="bg-primary text-white q-py-xs">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        >
          <q-tooltip>Menu</q-tooltip>
        </q-btn>

        <q-toolbar-title>
          {{ dashboardTitle }}
        </q-toolbar-title>

        <q-btn-dropdown flat icon="person">
          <q-list>
            <q-item clickable v-close-popup @click="onPerfil">
              <q-item-section avatar>
                <q-icon name="account_circle" color="primary" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Perfil</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="onLogout">
              <q-item-section avatar>
                <q-icon name="logout" color="negative" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Sair</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      :width="250"
      class="bg-grey-1"
    >
      <q-scroll-area class="fit">
        <q-list padding>
          <template v-if="userRole === 'escola'">
            <q-item clickable v-ripple to="/dashboard/escola" exact>
              <q-item-section avatar>
                <q-icon name="dashboard" color="primary" />
              </q-item-section>
              <q-item-section>Dashboard</q-item-section>
            </q-item>
            <q-item clickable v-ripple to="/dashboard/escola/professores">
              <q-item-section avatar>
                <q-icon name="school" color="primary" />
              </q-item-section>
              <q-item-section>Professores</q-item-section>
            </q-item>
            <!-- Other menu items remain unchanged -->
          </template>

          <!-- Other role templates remain unchanged -->
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
// Script remains unchanged
</script>

<style lang="scss" scoped>
.q-drawer {
  .q-item {
    border-radius: 8px;
    margin: 0 8px;
    
    &.q-router-link-active {
      background: rgba(var(--q-primary), 0.1);
      color: var(--q-primary);
    }
  }
}

.q-toolbar {
  min-height: 56px;
}

.q-btn {
  margin: 0 2px;
  
  &--round {
    height: 40px;
    width: 40px;
  }
}
</style>