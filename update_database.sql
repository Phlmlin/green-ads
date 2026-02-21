-- CE FICHIER CONTIENT LES MISES À JOUR NÉCESSAIRES POUR VOTRE BASE DE DONNÉES
-- Copiez tout le contenu ci-dessous et collez-le dans l'Éditeur SQL de votre tableau de bord Supabase.

-- 1. Création de la table 'conversations'
CREATE TABLE IF NOT EXISTS public.conversations (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  participant1_id uuid REFERENCES public.users(id) NOT NULL,
  participant2_id uuid REFERENCES public.users(id) NOT NULL,
  ad_id uuid REFERENCES public.ads(id) NOT NULL,
  last_message text,
  last_message_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(participant1_id, participant2_id, ad_id)
);

-- 2. Activation de la sécurité (RLS) pour 'conversations'
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

-- 3. Création des politiques de sécurité pour 'conversations'
-- Permettre aux utilisateurs de voir leurs propres conversations
CREATE POLICY "Users can view their conversations." ON public.conversations
  FOR SELECT USING (auth.uid() = participant1_id OR auth.uid() = participant2_id);

-- Permettre aux utilisateurs de créer une nouvelle conversation
CREATE POLICY "Users can insert conversations." ON public.conversations
  FOR INSERT WITH CHECK (auth.uid() = participant1_id OR auth.uid() = participant2_id);

-- Permettre aux utilisateurs de mettre à jour leurs conversations (ex: dernier message)
CREATE POLICY "Users can update their conversations." ON public.conversations
  FOR UPDATE USING (auth.uid() = participant1_id OR auth.uid() = participant2_id);

-- 4. Mise à jour de la table 'messages' pour lier aux conversations
-- Ajoute la colonne conversation_id si elle n'existe pas déjà
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'messages' AND column_name = 'conversation_id') THEN
    ALTER TABLE public.messages ADD COLUMN conversation_id uuid REFERENCES public.conversations(id) ON DELETE CASCADE;
  END IF;
END $$;

-- 5. (Optionnel) Si vous avez déjà des messages, vous pouvez vouloir nettoyer ou migrer les données ici.
-- Pour l'instant, nous supposons une nouvelle structure ou que les anciens messages seront orphelins sans conversation_id.
-- Si la colonne est NOT NULL, il faudrait d'abord créer les conversations pour les messages existants.
-- Pour simplifier, nous rendons la colonne nullable au début ou nous la laissons telle quelle si elle est ajoutée.
-- Note: Dans le schéma final, elle est NOT NULL. Si vous avez des données existantes, cela pourrait échouer sans migration de données complexe.
-- Si c'est le cas, exécutez d'abord: ALTER TABLE public.messages ALTER COLUMN conversation_id DROP NOT NULL;
