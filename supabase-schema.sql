-- VoiceChat - Schemat bazy danych Supabase
-- Wszystkie tabele w schemacie my_portfolio z prefiksem vc_

CREATE SCHEMA IF NOT EXISTS my_portfolio;

-- 1. Profiles (rozszerzenie auth.users)
CREATE TABLE IF NOT EXISTS my_portfolio.vc_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    avatar_url TEXT,
    status TEXT DEFAULT 'offline' CHECK (status IN ('online', 'offline', 'away')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE my_portfolio.vc_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "vc_profiles are viewable by authenticated users"
    ON my_portfolio.vc_profiles FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can update their own profile"
    ON my_portfolio.vc_profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION my_portfolio.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO my_portfolio.vc_profiles (id, username, avatar_url)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8)),
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION my_portfolio.handle_new_user();

-- 2. Rooms (pokoje rozmów)
CREATE TABLE IF NOT EXISTS my_portfolio.vc_rooms (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    created_by UUID REFERENCES my_portfolio.vc_profiles(id) ON DELETE SET NULL,
    is_private BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE my_portfolio.vc_rooms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "vc_rooms are viewable by authenticated users"
    ON my_portfolio.vc_rooms FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Authenticated users can create rooms"
    ON my_portfolio.vc_rooms FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- 3. Messages (wiadomości)
CREATE TABLE IF NOT EXISTS my_portfolio.vc_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    room_id UUID REFERENCES my_portfolio.vc_rooms(id) ON DELETE CASCADE NOT NULL,
    sender_id UUID REFERENCES my_portfolio.vc_profiles(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    type TEXT DEFAULT 'text' CHECK (type IN ('text', 'voice', 'system')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE my_portfolio.vc_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "vc_messages are viewable by authenticated users"
    ON my_portfolio.vc_messages FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Authenticated users can insert messages"
    ON my_portfolio.vc_messages FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = sender_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_vc_messages_room_id ON my_portfolio.vc_messages(room_id);
CREATE INDEX IF NOT EXISTS idx_vc_messages_created_at ON my_portfolio.vc_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_vc_rooms_created_at ON my_portfolio.vc_rooms(created_at DESC);

-- Realtime subscriptions
ALTER PUBLICATION supabase_realtime ADD TABLE my_portfolio.vc_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE my_portfolio.vc_rooms;
