<style>
    body {
      background-color: #010101;
    }
</style>

<template>
    <div class="d-flex flex-column flex-fill" style="height:100vh;">
      <BarTop class="mb-auto"/>
      <div>
        <slot/>
      </div>
      <BarBottom class="mt-auto"/>
    </div>
</template>