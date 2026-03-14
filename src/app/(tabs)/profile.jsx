import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  TextInput,
  Image,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../features/auth/hooks';
import { authApi } from '../../features/auth/api';
import { colors } from '../../theme/colors';
import RegisterScreen from '../(auth)/register';
import LoginScreen from '../(auth)/login';

// ---------- Unauthenticated view ----------

function GoogleButton() {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  async function handleGoogle() {
    try {
      setLoading(true);
      const res = await authApi.loginWithGoogle();
      login(res.user, res.token);
    } catch {
      Alert.alert('Lỗi', 'Đăng nhập Google thất bại.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <TouchableOpacity
      style={[guest.googleBtn, loading && { opacity: 0.65 }]}
      onPress={handleGoogle}
      disabled={loading}
      activeOpacity={0.85}
    >
      {loading ? (
        <ActivityIndicator color={colors.google} />
      ) : (
        <>
          <View style={guest.googleBadge}>
            <Text style={guest.googleLetter}>G</Text>
          </View>
          <Text style={guest.googleBtnText}>Tiếp tục với Google</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

function GuestView() {
  const [mode, setMode] = useState('login');

  if (mode === 'register') {
    return (
      <View style={{ flex: 1, marginTop: -40 }}>
        <RegisterScreen onSwitchMode={setMode} />
      </View>
    );
  }

  // Fallback to login form if not in register mode
  return (
    <View style={{ flex: 1, marginTop: -40 }}>
        <LoginScreen onSwitchMode={setMode} />
    </View>
  );
}

const guest = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingBottom: 100,
  },
  illustrationWrap: {
    marginBottom: 24,
  },
  circle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  segmentWrap: {
    width: '100%',
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  segmentBtn: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentBtnActive: {
    backgroundColor: colors.white,
  },
  segmentText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  segmentTextActive: {
    color: colors.primary,
  },
  formWrap: {
    width: '100%',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6,
  },
  input: {
    height: 48,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    backgroundColor: colors.white,
    color: colors.text,
    fontSize: 14,
  },
  inputError: {
    borderColor: colors.error,
    backgroundColor: colors.errorLight,
  },
  errorText: {
    fontSize: 12,
    color: colors.error,
    marginTop: 4,
  },
  primaryBtn: {
    width: '100%',
    height: 52,
    backgroundColor: colors.primary,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryBtnText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryBtn: {
    width: '100%',
    height: 52,
    backgroundColor: colors.secondary,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  secondaryBtnText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '700',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    fontSize: 13,
    color: colors.textMuted,
    marginHorizontal: 14,
  },
  googleBtn: {
    width: '100%',
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginBottom: 36,
  },
  googleBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.google,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  googleLetter: {
    color: colors.white,
    fontWeight: '900',
    fontSize: 14,
  },
  googleBtnText: {
    fontSize: 15,
    color: colors.text,
    fontWeight: '600',
  },
  featuresWrap: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    gap: 14,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    flex: 1,
  },
});

// ---------- Authenticated view ----------

function UserProfile() {
  const { user, logout } = useAuth();
  const { top: topInset } = useSafeAreaInsets();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    Alert.alert('Đăng xuất', 'Bạn có chắc muốn đăng xuất không?', [
      { text: 'Huỷ', style: 'cancel' },
      {
        text: 'Đăng xuất',
        style: 'destructive',
        onPress: async () => {
          setIsLoggingOut(true);
          await authApi.logout();
          logout();
          setIsLoggingOut(false);
        },
      },
    ]);
  }

  const initials = (user?.username || user?.name)
    ? (user.username || user.name)
      .split(' ')
      .map((w) => w[0])
      .slice(0, 2)
      .join('')
      .toUpperCase()
    : '?';

  return (
    <ScrollView
      contentContainerStyle={[prof.scroll, { paddingTop: topInset + 24 }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Avatar */}
      <View style={prof.avatarWrap}>
        {user?.avatar ? (
          <Image source={{ uri: user.avatar }} style={prof.avatarImg} />
        ) : (
          <View style={prof.avatarFallback}>
            <Text style={prof.avatarInitials}>{initials}</Text>
          </View>
        )}
        {user?.provider === 'google' && (
          <View style={prof.providerBadge}>
            <Text style={prof.providerLetter}>G</Text>
          </View>
        )}
      </View>
      <Text style={prof.name}>{user?.username || user?.name}</Text>
      <Text style={prof.email}>{user?.email}</Text>

      {/* Stats */}
      <View style={prof.statsRow}>
        {[
          { label: 'Đang đọc', value: '0' },
          { label: 'Bookmark', value: '0' },
          { label: 'Hoàn thành', value: '0' },
        ].map((s, i, arr) => (
          <React.Fragment key={s.label}>
            <View style={prof.statItem}>
              <Text style={prof.statValue}>{s.value}</Text>
              <Text style={prof.statLabel}>{s.label}</Text>
            </View>
            {i < arr.length - 1 && <View style={prof.statDivider} />}
          </React.Fragment>
        ))}
      </View>

      {/* Menu */}
      <View style={prof.menuSection}>
        {[
          { icon: 'person-outline', label: 'Chỉnh sửa hồ sơ' },
          { icon: 'bookmark-outline', label: 'Bookmark của tôi' },
          { icon: 'time-outline', label: 'Lịch sử đọc' },
          { icon: 'download-outline', label: 'Truyện đã tải' },
          { icon: 'notifications-outline', label: 'Thông báo' },
          { icon: 'settings-outline', label: 'Cài đặt' },
          { icon: 'help-circle-outline', label: 'Trợ giúp & Phản hồi' },
        ].map((item, idx, arr) => (
          <TouchableOpacity
            key={item.label}
            style={[prof.menuItem, idx === arr.length - 1 && { borderBottomWidth: 0 }]}
            activeOpacity={0.7}
          >
            <View style={prof.menuIconWrap}>
              <Ionicons name={item.icon} size={20} color={colors.primary} />
            </View>
            <Text style={prof.menuLabel}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Logout */}
      <TouchableOpacity
        style={[prof.logoutBtn, isLoggingOut && { opacity: 0.65 }]}
        onPress={handleLogout}
        disabled={isLoggingOut}
        activeOpacity={0.85}
      >
        {isLoggingOut ? (
          <ActivityIndicator color={colors.error} />
        ) : (
          <>
            <Ionicons name="log-out-outline" size={20} color={colors.error} />
            <Text style={prof.logoutText}>Đăng xuất</Text>
          </>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const prof = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    paddingBottom: 100,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  avatarWrap: {
    position: 'relative',
    marginBottom: 12,
  },
  avatarImg: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: colors.border,
  },
  avatarFallback: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.secondary,
    borderWidth: 3,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    fontSize: 44,
    fontWeight: '800',
    color: colors.primary,
  },
  providerBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.google,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  providerLetter: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '900',
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  email: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 24,
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginVertical: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  menuSection: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 12,
  },
  menuIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
    fontWeight: '500',
  },
  logoutBtn: {
    width: '100%',
    height: 52,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.error,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: colors.errorLight,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.error,
  },
});

// ---------- Root ----------

export default function ProfileTab() {
  const { isAuthenticated } = useAuth();

  return (
    <SafeAreaView style={root.container} edges={[]}>
      {isAuthenticated ? <UserProfile /> : <GuestView />}
    </SafeAreaView>
  );
}

const root = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
