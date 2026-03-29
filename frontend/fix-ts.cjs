const fs = require('fs');
const path = require('path');

function walk(dir, fn) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const p = path.join(dir, file);
        if (fs.statSync(p).isDirectory()) walk(p, fn);
        else fn(p);
    }
}

walk('./src', (file) => {
    if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        let text = fs.readFileSync(file, 'utf8');
        let changed = false;

        if ((text.includes('from \'../lib/utils\'') || text.includes('from \"../lib/utils\"')) && file.includes('/ui/')) {
            text = text.replace(/from '\.\.\/lib\/utils'/g, \"from '../../lib/utils'\");
       text = text.replace(/from \"\.\.\/lib\/utils\"/g, 'from \"../../lib/utils\"');
            changed = true;
        }

        if (file.endsWith('Header.tsx') && text.includes('variant = \'secondary\'')) {
            text = text.replace('variant = \'secondary\'', '');
            text = text.replace(', variant?: string', '');
            changed = true;
        }

        if (file.endsWith('Addresses.tsx')) {
            text = text.replace('resolver: zodResolver(addressSchema),', 'resolver: zodResolver(addressSchema) as any,');
            text = text.replace('onSubmit = async (data: AddressForm)', 'onSubmit = async (data: any)');
            changed = true;
        }

        if (file.endsWith('Account.tsx') && text.includes('const { user, logout }')) {
            text = text.replace('const { user, logout }', 'const { logout }');
            changed = true;
        }

        if (file.endsWith('Checkout.tsx')) {
            text = text.replace('function CheckoutForm({ clientSecret, totalAmount, onSuccess }', 'function CheckoutForm({ totalAmount, onSuccess }');
            text = text.replace('const { user } = useAuthStore();', '');
            text = text.replace('.catch(err => {', '.catch(() => {');
            changed = true;
        }

        if (file.endsWith('Home.tsx')) {
            text = text.replace(\"import { StarRating } from '../components/ui/StarRating';\", '');
       text = text.replace('data: electronicsData, isLoading: isLoadingElectronics', '');
            changed = true;
        }

        if (file.endsWith('Orders.tsx')) {
            text = text.replace(\"import { Badge } from '../components/ui/Badge';\", '');
       changed = true;
        }

        if (file.endsWith('ProductDetail.tsx')) {
            text = text.replace(\", ArrowLeft, Heart\", \", Heart\");
       changed = true;
        }

        if (file.endsWith('Toast.tsx') && text.includes('import { cn }')) {
            text = text.replace('import { cn } from \"../../lib/utils\"', '');
            text = text.replace('import { cn } from \"../lib/utils\"', '');
            changed = true;
        }

        if (changed) {
            fs.writeFileSync(file, text);
        }
    }
});
console.log('Fixed TS errors');
