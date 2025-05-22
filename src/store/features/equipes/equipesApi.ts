import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface Equipe {
  id: number;
  nom: string;
  drapeau: string;
  groupe: string;
  confederation: string;
  entraineur: string;
  abreviation?: string;
  rang?: number;
  points: number;
  joues: number;
  gagnes: number;
  nuls: number;
  perdus: number;
  buts_marques: number;
  buts_encaisses: number;
  difference_buts: number;
}

export const equipesApi = createApi({
  reducerPath: 'equipesApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://127.0.0.1:8000/api/' }),
  tagTypes: ['Equipe'],
  endpoints: (builder) => ({
    // Get all equipes
    getEquipes: builder.query({
      query: () => 'equipes',
      providesTags: ['Equipe'],
    }),

    // Get single equipe
    getEquipe: builder.query<Equipe, number>({
      query: (id) => `/equipes/${id}`,
      providesTags: (result, error, id) => [{ type: 'Equipe', id }],
    }),

    // Create equipe
    createEquipe: builder.mutation({
      query: (equipe) => ({
        url: 'equipes',
        method: 'POST',
        body: equipe,
      }),
      invalidatesTags: ['Equipe'],
    }),

    // Update equipe
    updateEquipe: builder.mutation({
      query: ({ id, equipe }) => ({
        url: `equipes/${id}`,
        method: 'PUT',
        body: equipe,
      }),
      invalidatesTags: ['Equipe'],
    }),

    // Delete equipe
    deleteEquipe: builder.mutation({
      query: (id) => ({
        url: `equipes/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Equipe'],
    }),
  }),
});

export const {
  useGetEquipesQuery,
  useGetEquipeQuery,
  useCreateEquipeMutation,
  useUpdateEquipeMutation,
  useDeleteEquipeMutation,
} = equipesApi; 