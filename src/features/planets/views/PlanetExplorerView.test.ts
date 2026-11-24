import { defineComponent } from 'vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import PlanetExplorerView from './PlanetExplorerView.vue';

const SolarSystem3DStub = defineComponent({
  emits: ['select'],
  template: '<button class="select-mars" @click="$emit(\'select\', \'mars\')">Seleccionar Marte</button>',
});

describe('PlanetExplorerView', () => {
  it('updates the selected body panel when a planet is picked in the 3D scene', async () => {
    const wrapper = mount(PlanetExplorerView, {
      global: {
        stubs: { SolarSystem3D: SolarSystem3DStub, RouterLink: true },
        directives: { reveal: {} },
      },
    });

    expect(wrapper.text()).toContain('Tierra');
    await wrapper.find('.select-mars').trigger('click');
    expect(wrapper.text()).toContain('Marte');
    expect(wrapper.text()).toContain('687 días terrestres');
  });
});
