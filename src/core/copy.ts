import { ref } from "vue";

export default function useCopy(arg: string = "") {
  const copy = ref<string>(arg);

  return {
    copy,
  };
}
