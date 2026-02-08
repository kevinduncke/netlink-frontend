<script setup>
import { useAuthStore } from '../stores/auth';

const auth = useAuthStore();
auth.setAuth({ id: "1", username: 'kevinduncke', email: 'kevinduncke@netlink.com' }, 'token123');
</script>