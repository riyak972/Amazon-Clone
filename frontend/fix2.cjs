const fs = require('fs');

function replaceInFile(p, searchStr, replaceStr) {
    if (fs.existsSync(p)) {
        let c = fs.readFileSync(p, 'utf8');
        if (c.includes(searchStr)) {
            fs.writeFileSync(p, c.split(searchStr).join(replaceStr));
        }
    }
}

const uiFiles = ['Badge.tsx', 'Button.tsx', 'Drawer.tsx', 'Input.tsx', 'Modal.tsx', 'Skeleton.tsx', 'StarRating.tsx'];
for (let f of uiFiles) {
    replaceInFile('./src/components/ui/' + f, \"import { cn } from '../lib/utils'\", \"import { cn } from '../../lib/utils'\");
  replaceInFile('./src/components/ui/' + f, 'import { cn } from \"../lib/utils\"', 'import { cn } from \"../../lib/utils\"');
}

replaceInFile('./src/components/ui/Toast.tsx', 'import { cn } from \"../lib/utils\"', '');

replaceInFile('./src/components/layout/Header.tsx', \"variant = 'secondary'\", \"\");
replaceInFile('./src/components/layout/Header.tsx', \", variant?: string\", \"\");

replaceInFile('./src/pages/Addresses.tsx', 'resolver: zodResolver(addressSchema),', 'resolver: zodResolver(addressSchema) as any,');
replaceInFile('./src/pages/Addresses.tsx', 'onSubmit = async (data: AddressForm)', 'onSubmit = async (data: any)');

replaceInFile('./src/pages/Account.tsx', 'const { user, logout }', 'const { logout }');

replaceInFile('./src/pages/Checkout.tsx', 'function CheckoutForm({ clientSecret, totalAmount, onSuccess }', 'function CheckoutForm({ totalAmount, onSuccess }');
replaceInFile('./src/pages/Checkout.tsx', 'const { user } = useAuthStore();', '');
replaceInFile('./src/pages/Checkout.tsx', '.catch(err => {', '.catch(() => {');

replaceInFile('./src/pages/Home.tsx', \"import { StarRating } from '../components/ui/StarRating';\", \"\");
replaceInFile('./src/pages/Home.tsx', \"const { data: electronicsData, isLoading: isLoadingElectronics }\", \"const { }\");

replaceInFile('./src/pages/Orders.tsx', \"import { Badge } from '../components/ui/Badge';\", \"\");

replaceInFile('./src/pages/ProductDetail.tsx', \"ShieldCheck, ArrowLeft, Heart\", \"ShieldCheck, Heart\");

console.log('Done fixes');
