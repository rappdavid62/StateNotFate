package com.example.snfintake.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable

private val CustomDarkColorScheme = darkColorScheme(
    primary = AccentTeal,
    secondary = AccentOrange,
    tertiary = AccentLavender,
    background = BgPrimary,
    surface = BgSecondary,
    onPrimary = BgPrimary,
    onSecondary = BgPrimary,
    onTertiary = BgPrimary,
    onBackground = TextPrimary,
    onSurface = TextPrimary,
    surfaceVariant = CardBg,
    onSurfaceVariant = TextSecondary,
    outline = AccentTealDim
)

@Composable
fun SNFIntakeTheme(
    content: @Composable () -> Unit
) {
    // We enforce our custom premium dark theme directly for the State Not Fate brand sanctuary feel.
    MaterialTheme(
        colorScheme = CustomDarkColorScheme,
        typography = Typography,
        content = content
    )
}
