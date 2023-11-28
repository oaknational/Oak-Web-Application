const mockAxios = jest.genMockFromModule("@oak-academy/oak-components");
mockAxios.create = jest.fn(() => mockAxios);

export default mockAxios;
