declare module "aladin-lite"

declare module "@sentry/vue"

//Creating a type for the schema and types of a DSO item that is stored in the database
declare interface DsoObject {
  name_fr?: string
  name_en?: string
  name_extra?: string[]
  type?: string
  constellation?: {} //TODO: A remplir
  major_axis?: number
  minor_axis?: number
  position_angle?: number
  b_magnitude?: number
  v_magnitude?: number
  j_magnitude?: number
  h_magnitude?: number
  k_magnitude?: number
  surface_brightness?: number
  hubble_type?: string
  parallax?: number
  proper_motion_ra?: number
  proper_motion_dec?: number
  radial_velocity?: number
  redshift?: number
  common_star_u_mag?: number
  common_star_b_mag?: number
  common_star_v_mag?: number
  messier?: string[]
  new_general_catalog?: string[]
  index_catalog?: string[]
  common_star_names?: string[]
  identifiers?: string[]
  ned_notes?: string[]
  open_ngc_notes?: string[]
  sources?: string
  right_ascension?: any //TODO: change for number
  declination?: any //TODO: change for number
  modules?: string[]
}
