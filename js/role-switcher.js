<script>
    function toggleRoleSwitcher() {
    const menu = document.getElementById('roleSwitcher');
    menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
}

    // Close dropdown when clicking outside
    document.addEventListener('click', function(event) {
    const menu = document.getElementById('roleSwitcher');
    const button = event.target.closest('button[onclick="toggleRoleSwitcher()"]');

    if (!button && menu && !menu.contains(event.target)) {
        menu.style.display = 'none';
    }
});
</script>
