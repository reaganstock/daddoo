-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist
DROP TABLE IF EXISTS memories CASCADE;
DROP TABLE IF EXISTS audio_messages CASCADE;
DROP TABLE IF EXISTS fun_facts CASCADE;
DROP TABLE IF EXISTS tributes CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS celebrations CASCADE;

-- Create users table for extended profile info
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_id UUID REFERENCES auth.users(id),
    email TEXT UNIQUE,
    first_name TEXT,
    last_name TEXT,
    is_admin BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Create celebrations table for different celebration pages
CREATE TABLE celebrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    access_code TEXT UNIQUE NOT NULL,
    owner_id UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    celebration_date DATE,
    is_active BOOLEAN DEFAULT true
);

-- Create tributes table
CREATE TABLE tributes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    celebration_id UUID REFERENCES celebrations(id),
    title TEXT,
    content TEXT NOT NULL,
    audio_url TEXT,
    signature_url TEXT DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    user_id UUID REFERENCES auth.users(id),
    user_email TEXT,
    is_deleted BOOLEAN DEFAULT false,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Create memories table
CREATE TABLE memories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    celebration_id UUID REFERENCES celebrations(id),
    title TEXT,
    content TEXT,
    image_url TEXT,
    video_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    user_id UUID REFERENCES auth.users(id),
    user_email TEXT,
    is_deleted BOOLEAN DEFAULT false,
    metadata JSONB DEFAULT '{}'::jsonb,
    CHECK (image_url IS NOT NULL OR video_url IS NOT NULL)
);

-- Create fun_facts table
CREATE TABLE fun_facts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    celebration_id UUID REFERENCES celebrations(id),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    user_id UUID REFERENCES auth.users(id),
    user_email TEXT,
    is_deleted BOOLEAN DEFAULT false,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_celebrations_updated_at
    BEFORE UPDATE ON celebrations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tributes_updated_at
    BEFORE UPDATE ON tributes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_memories_updated_at
    BEFORE UPDATE ON memories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fun_facts_updated_at
    BEFORE UPDATE ON fun_facts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE tributes ENABLE ROW LEVEL SECURITY;
ALTER TABLE memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE fun_facts ENABLE ROW LEVEL SECURITY;

-- Policies for memories
DROP POLICY IF EXISTS "Allow public read access to memories" ON memories;
DROP POLICY IF EXISTS "Allow authenticated users to create memories" ON memories;
DROP POLICY IF EXISTS "Allow users to update their own memories" ON memories;
DROP POLICY IF EXISTS "Allow users to delete their own memories" ON memories;

CREATE POLICY "Allow public read access to memories"
ON memories FOR SELECT
USING (true);

CREATE POLICY "Allow authenticated users to create memories"
ON memories FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to update their own memories"
ON memories FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Allow users to delete their own memories"
ON memories FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Policies for tributes
DROP POLICY IF EXISTS "Allow public read access to tributes" ON tributes;
DROP POLICY IF EXISTS "Allow authenticated users to create tributes" ON tributes;
DROP POLICY IF EXISTS "Allow users to update their own tributes" ON tributes;
DROP POLICY IF EXISTS "Allow users to delete their own tributes" ON tributes;

CREATE POLICY "Allow public read access to tributes"
ON tributes FOR SELECT
USING (true);

CREATE POLICY "Allow authenticated users to create tributes"
ON tributes FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to update their own tributes"
ON tributes FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Allow users to delete their own tributes"
ON tributes FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Policies for fun facts
DROP POLICY IF EXISTS "Allow public read access to fun_facts" ON fun_facts;
DROP POLICY IF EXISTS "Allow authenticated users to create fun_facts" ON fun_facts;
DROP POLICY IF EXISTS "Allow users to update their own fun_facts" ON fun_facts;
DROP POLICY IF EXISTS "Allow users to delete their own fun_facts" ON fun_facts;

CREATE POLICY "Allow public read access to fun_facts"
ON fun_facts FOR SELECT
USING (true);

CREATE POLICY "Allow authenticated users to create fun_facts"
ON fun_facts FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to update their own fun_facts"
ON fun_facts FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Allow users to delete their own fun_facts"
ON fun_facts FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Insert default celebration for daddoo
INSERT INTO celebrations (title, description, access_code, owner_id)
VALUES (
    'Daddoo''s Birthday Celebration',
    'Mark your calendars for this heavenly celebration!',
    'DADDOO',
    NULL
);

-- Get the celebration ID
DO $$
DECLARE
    celebration_id UUID;
BEGIN
    SELECT id INTO celebration_id FROM celebrations WHERE access_code = 'DADDOO';

    -- Insert default memories
    INSERT INTO memories (celebration_id, title, content, image_url, created_at, user_email)
    VALUES 
        (celebration_id, '', '', 'https://imgur.com/m9dIxdM.jpg', NOW() - INTERVAL '10 days', 'reagan@gmail.com'),
        (celebration_id, '', '', 'https://imgur.com/XWQxuCg.jpg', NOW() - INTERVAL '10 days', 'reagan@gmail.com'),
        (celebration_id, '', '', 'https://imgur.com/wUln2kq.jpg', NOW() - INTERVAL '10 days', 'reagan@gmail.com'),
        (celebration_id, '', '', 'https://imgur.com/NDEzhu6.jpg', NOW() - INTERVAL '10 days', 'reagan@gmail.com'),
        (celebration_id, '', '', 'https://imgur.com/YEqEAbZ.jpg', NOW() - INTERVAL '10 days', 'reagan@gmail.com');

    -- Insert birthday tribute
    INSERT INTO tributes (celebration_id, title, content, created_at, user_email)
    VALUES (
        celebration_id,
        'A Birthday Tribute',
        E'Hey daddoo, it\'s your son here, talking through the Interweb.www. I hope you are doing well on this fine day, because gosh darn, you deserve to be (doing well (on this fine day)).\n\nI hope that storms and blizzards never come your way. Well, that\'s enough for me, I\'ve got to hit the hay.\n\nJust kidding, let\'s pray:\n\nI pray that my dad has an exceptional year full of exceptional blessings. Amen.\n\nWhat I meant to say, is that I\'m not so good at this. I just write random words and un-oddly enough, I pick the most basic word to rhyme, "day." Not very impressive.\n\nBut today\'s not about me. It\'s about my padre.\n\nYou\'re smart, kind, and the best cook known to man. I\'m sorry I made this idiotic website instead of buying you a frying pan... this isn\'t funny. damn.\n\nThat\'s enough of this. Happy birthday daddoo.\n\nFrom Reagan',
        NOW(),
        'reagan@gmail.com'
    );
END $$;
